export interface PromptOptimization {
  optimized: string;
  explanation: string;
  tokens: number;
}

export interface StructuredPrompt {
  subject: string;
  style?: string;
  lighting?: string;
  camera?: string;
  colors?: string[];
  atmosphere?: string;
}

export class PromptOptimizer {
  private static readonly QUALITY_TAGS = 'high quality, detailed, 8k resolution';
  
  private static readonly STYLE_ENHANCEMENTS = {
    portrait: 'professional studio lighting, shallow depth of field, bokeh',
    landscape: 'golden hour, wide angle, atmospheric perspective, HDR',
    product: 'clean background, studio lighting, commercial photography, sharp focus',
    cyberpunk: 'neon lights, rain-soaked streets, futuristic architecture, blade runner aesthetic',
    anime: 'anime style, vibrant colors, cel shaded, clean lines',
    realistic: 'photorealistic, natural lighting, real world physics',
    artistic: 'oil painting, artistic interpretation, expressive brushstrokes',
    minimalist: 'minimalist design, clean composition, negative space'
  };

  static optimize(userPrompt: string): PromptOptimization {
    let optimized = userPrompt.trim();
    
    // Detect and enhance style
    for (const [key, enhancement] of Object.entries(this.STYLE_ENHANCEMENTS)) {
      if (optimized.toLowerCase().includes(key)) {
        optimized = `${optimized}, ${enhancement}`;
        break;
      }
    }
    
    // Add quality tags
    if (!optimized.toLowerCase().includes('quality')) {
      optimized += `, ${this.QUALITY_TAGS}`;
    }
    
    // Token optimization
    const tokens = this.estimateTokens(optimized);
    if (tokens > 300) {
      optimized = this.truncatePrompt(optimized, 300);
    }
    
    return {
      optimized,
      explanation: 'Enhanced with style-specific terms and quality tags',
      tokens: this.estimateTokens(optimized)
    };
  }

  static buildJSONPrompt(structured: StructuredPrompt): string {
    const parts = [
      structured.subject,
      structured.style && `style: ${structured.style}`,
      structured.lighting && `lighting: ${structured.lighting}`,
      structured.camera && `camera: ${structured.camera}`,
      structured.colors && `colors: ${structured.colors.join(', ')}`,
      structured.atmosphere && `atmosphere: ${structured.atmosphere}`
    ].filter(Boolean);
    
    return parts.join(', ');
  }

  static withHexColors(prompt: string, hexColors: string[]): string {
    return `${prompt}, color palette: ${hexColors.join(' ')}`;
  }

  private static estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }

  private static truncatePrompt(text: string, maxTokens: number): string {
    const words = text.split(/\s+/);
    const targetWords = Math.floor(maxTokens / 1.3);
    return words.slice(0, targetWords).join(' ');
  }
}
