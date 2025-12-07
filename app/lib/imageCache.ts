export class ImageCache {
  static generateKey(prompt: string, settings: any): string {
    const data = JSON.stringify({ prompt, settings });
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `img_${Math.abs(hash).toString(36)}`;
  }

  static async get(key: string, env: any): Promise<ArrayBuffer | null> {
    try {
      const cached = await env.IMAGE_CACHE?.get(key, 'arrayBuffer');
      return cached || null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  static async set(
    key: string, 
    image: ArrayBuffer, 
    env: any,
    ttl: number = 604800
  ): Promise<void> {
    try {
      await env.IMAGE_CACHE?.put(key, image, { 
        expirationTtl: ttl 
      });
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  static async has(key: string, env: any): Promise<boolean> {
    const value = await this.get(key, env);
    return value !== null;
  }
}
