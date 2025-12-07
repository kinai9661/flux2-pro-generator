import { NextRequest } from 'next/server';
import { RateLimiter } from '@/lib/rateLimiter';

export const runtime = 'edge';

const rateLimiter = new RateLimiter(3, 1000);

interface BatchRequest {
  prompts: string[];
  settings?: {
    width?: number;
    height?: number;
    num_steps?: number;
    guidance?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { prompts, settings = {} }: BatchRequest = await request.json();
    
    const maxBatch = 10;
    const limitedPrompts = prompts.slice(0, maxBatch);

    // @ts-ignore
    const env = process.env as any;

    const results = await Promise.allSettled(
      limitedPrompts.map((prompt, index) =>
        rateLimiter.add(async () => {
          const response = await env.AI.run(
            '@cf/black-forest-labs/flux-2-dev',
            {
              prompt,
              width: settings.width || 1024,
              height: settings.height || 1024,
              num_steps: settings.num_steps || 4,
              guidance: settings.guidance || 3.5
            }
          );
          
          return {
            index,
            prompt,
            image: Buffer.from(await response.arrayBuffer()).toString('base64')
          };
        })
      )
    );

    const successful = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map(r => r.value);

    const failed = results
      .filter(r => r.status === 'rejected')
      .length;

    return new Response(JSON.stringify({
      total: limitedPrompts.length,
      successful: successful.length,
      failed,
      results: successful
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
