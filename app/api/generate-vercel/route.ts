import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 30;

interface GenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
  num_steps?: number;
  guidance?: number;
  seed?: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: GenerateRequest = await request.json();
    const {
      prompt,
      width = 1024,
      height = 1024,
      num_steps = 4,
      guidance = 3.5,
      seed
    } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get Cloudflare credentials from environment
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { 
          error: 'Cloudflare credentials not configured',
          hint: 'Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in Vercel environment variables'
        },
        { status: 500 }
      );
    }

    // Call Cloudflare Workers AI REST API
    const cloudflareResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-2-dev`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          width,
          height,
          num_steps,
          guidance,
          ...(seed && { seed })
        })
      }
    );

    if (!cloudflareResponse.ok) {
      const errorText = await cloudflareResponse.text();
      console.error('Cloudflare API error:', errorText);
      throw new Error(`Cloudflare API returned ${cloudflareResponse.status}: ${errorText}`);
    }

    const imageBuffer = await cloudflareResponse.arrayBuffer();
    const duration = Date.now() - startTime;

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'X-Generation-Time': `${duration}ms`,
        'X-Platform': 'Vercel',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error.message,
        duration: Date.now() - startTime,
        platform: 'Vercel'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
