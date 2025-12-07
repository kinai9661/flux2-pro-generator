export interface StylePreset {
  name: string;
  suffix: string;
  guidance: number;
  num_steps: number;
  width: number;
  height: number;
  description: string;
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  photorealistic: {
    name: 'Photorealistic',
    suffix: 'photorealistic, 8k, highly detailed, professional photography, natural lighting',
    guidance: 3.5,
    num_steps: 6,
    width: 1024,
    height: 1024,
    description: 'Ultra-realistic photos with natural lighting'
  },
  anime: {
    name: 'Anime',
    suffix: 'anime style, vibrant colors, cel shaded, Studio Ghibli inspired, clean lines',
    guidance: 4.0,
    num_steps: 4,
    width: 1024,
    height: 1024,
    description: 'Japanese anime art style'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    suffix: 'cyberpunk aesthetic, neon lights, dark atmosphere, futuristic, blade runner style',
    guidance: 3.8,
    num_steps: 5,
    width: 1024,
    height: 1024,
    description: 'Neon-lit futuristic scenes'
  },
  minimalist: {
    name: 'Minimalist',
    suffix: 'minimalist design, clean lines, simple composition, white background, modern',
    guidance: 3.0,
    num_steps: 3,
    width: 1024,
    height: 1024,
    description: 'Clean and simple designs'
  },
  vintage: {
    name: 'Vintage',
    suffix: 'vintage photography, film grain, warm tones, nostalgic, retro aesthetic',
    guidance: 3.5,
    num_steps: 4,
    width: 1024,
    height: 1024,
    description: 'Retro and nostalgic feel'
  },
  portrait: {
    name: 'Portrait',
    suffix: 'professional portrait, studio lighting, shallow depth of field, bokeh, 85mm lens',
    guidance: 3.7,
    num_steps: 5,
    width: 768,
    height: 1024,
    description: 'Professional portrait photography'
  },
  landscape: {
    name: 'Landscape',
    suffix: 'landscape photography, golden hour, wide angle, atmospheric, HDR, majestic',
    guidance: 3.5,
    num_steps: 5,
    width: 1024,
    height: 768,
    description: 'Stunning landscape scenes'
  },
  product: {
    name: 'Product',
    suffix: 'product photography, white background, studio lighting, commercial, sharp details',
    guidance: 3.3,
    num_steps: 4,
    width: 1024,
    height: 1024,
    description: 'E-commerce product shots'
  }
};

export function applyStylePreset(
  prompt: string, 
  presetKey: keyof typeof STYLE_PRESETS
) {
  const preset = STYLE_PRESETS[presetKey];
  return {
    prompt: `${prompt}, ${preset.suffix}`,
    guidance: preset.guidance,
    num_steps: preset.num_steps,
    width: preset.width,
    height: preset.height
  };
}
