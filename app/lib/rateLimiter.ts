export class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private readonly maxConcurrent: number;
  private readonly delayMs: number;

  constructor(maxConcurrent = 3, delayMs = 1000) {
    this.maxConcurrent = maxConcurrent;
    this.delayMs = delayMs;
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.maxConcurrent);
      await Promise.all(batch.map(task => task()));
      
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delayMs));
      }
    }
    
    this.processing = false;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}
