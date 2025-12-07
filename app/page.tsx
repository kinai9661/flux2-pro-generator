'use client';

import { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import BatchGenerator from './components/BatchGenerator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-md inline-flex">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'single'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎨 Single Generation
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'batch'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔥 Batch Generation
          </button>
        </div>
      </div>

      {activeTab === 'single' ? <ImageGenerator /> : <BatchGenerator />}

      <footer className="text-center mt-12 text-gray-600 text-sm">
        <p>Powered by <strong>Cloudflare Workers AI</strong> • FLUX.2 [dev]</p>
        <p className="mt-2">
          <a href="https://github.com/kinai9661/flux2-pro-generator" className="text-blue-600 hover:underline">
            GitHub
          </a>
          {' • '}
          <a href="https://developers.cloudflare.com/workers-ai/" className="text-blue-600 hover:underline">
            Documentation
          </a>
        </p>
      </footer>
    </main>
  );
}
