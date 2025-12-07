import { NextRequest } from 'next/server';
import { ImageCache } from '@/lib/imageCache';
import { PromptOptimizer } from '@/lib/promptOptimizer';

export const runtime = 'edge';

interface GenerateRequest {
  prompt: string;
  width?: number;
  height?: number;
  num_steps?: number;
  guidance?: number;
  seed?: number;
  optimize?: boolean;
  useCache?: boolean;
}

interface CloudflareEnv {
  AI: any;
  IMAGE_CACHE: any;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: GenerateRequest = await request.json();
    let {
      prompt,
      width = 1024,
      height = 1024,
      num_steps = 4,
      guidance = 3.5,
      seed,
      optimize = true,
      useCache = true
    } = body;

    if (!prompt || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // @ts-ignore
    const env = process.env as unknown as CloudflareEnv;

    if (optimize) {
      const optimized = PromptOptimizer.optimize(prompt);
      prompt = optimized.optimized;
    }

    const settings = { prompt, width, height, num_steps, guidance, seed };
    const cacheKey = ImageCache.generateKey(prompt, settings);

    if (useCache) {
      const cached = await ImageCache.get(cacheKey, env);
      if (cached) {
        const duration = Date.now() - startTime;
        return new Response(cached, {
          headers: {
            'Content-Type': 'image/png',
            'X-Cache': 'HIT',
            'X-Generation-Time': `${duration}ms`,
            'Cache-Control': 'public, max-age=604800',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    const aiResponse = await env.AI.run(
      '@cf/black-forest-labs/flux-2-dev',
      {
        prompt,
        width,
        height,
        num_steps,
        guidance,
        ...(seed && { seed })
      }
    );

    const imageBuffer = await aiResponse.arrayBuffer();

    if (useCache) {
      await ImageCache.set(cacheKey, imageBuffer, env);
    }

    const duration = Date.now() - startTime;

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'X-Cache': 'MISS',
        'X-Generation-Time': `${duration}ms`,
        'X-Optimized-Prompt': optimize ? 'true' : 'false',
        'Cache-Control': 'public, max-age=604800',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image',
        details: error.message,
        duration: Date.now() - startTime
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
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
