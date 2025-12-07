'use client';

import { useState } from 'react';

export default function BatchGenerator() {
  const [prompts, setPrompts] = useState<string[]>(['', '', '']);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [platform, setPlatform] = useState<string>('unknown');
  const [error, setError] = useState<string | null>(null);

  // 自动检测平台并选择正确的 API endpoint
  const getApiEndpoint = () => {
    const isVercel = typeof window !== 'undefined' && (
      window.location.hostname.includes('vercel.app') ||
      process.env.NEXT_PUBLIC_VERCEL_URL
    );
    
    const isCloudflare = typeof window !== 'undefined' && (
      window.location.hostname.includes('pages.dev') ||
      process.env.CF_PAGES
    );

    if (isVercel) {
      setPlatform('Vercel');
      return '/api/batch-generate-vercel';
    } else if (isCloudflare) {
      setPlatform('Cloudflare');
      return '/api/batch-generate';
    } else {
      setPlatform('Local');
      return '/api/batch-generate';
    }
  };

  const updatePrompt = (index: number, value: string) => {
    const updated = [...prompts];
    updated[index] = value;
    setPrompts(updated);
  };

  const addPrompt = () => {
    if (prompts.length < 10) {
      setPrompts([...prompts, '']);
    }
  };
  
  const removePrompt = (index: number) => {
    if (prompts.length > 1) {
      setPrompts(prompts.filter((_, i) => i !== index));
    }
  };

  const generateBatch = async () => {
    const validPrompts = prompts.filter(p => p.trim());
    if (validPrompts.length === 0) return;

    setLoading(true);
    setResults([]);
    setError(null);
    setProgress({ current: 0, total: validPrompts.length });

    const apiEndpoint = getApiEndpoint();

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: validPrompts })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
      setProgress({ current: data.successful || 0, total: data.total || validPrompts.length });
    } catch (err: any) {
      console.error('Batch generation error:', err);
      setError(err.message || 'Failed to generate images. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = () => {
    results.forEach((result, i) => {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${result.image}`;
      link.download = `flux2-batch-${i + 1}.png`;
      link.click();
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">🔥 Batch Generator</h2>
        <p className="text-gray-600">
          Generate multiple images at once (Max 10)
          {platform !== 'unknown' && (
            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
              Running on {platform}
            </span>
          )}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <span className="text-red-500 text-xl">⚠️</span>
          <div className="flex-1">
            <p className="text-red-700 font-medium">Batch Generation Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <p className="text-red-500 text-xs mt-2">
              Platform: {platform} • Check console for details
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Prompts ({prompts.length}/10)</h3>
            <button
              onClick={addPrompt}
              disabled={prompts.length >= 10}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm transition-colors"
            >
              + Add Prompt
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {prompts.map((prompt, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 block mb-1">Prompt {i + 1}</label>
                  <input
                    value={prompt}
                    onChange={(e) => updatePrompt(i, e.target.value)}
                    placeholder={`Enter prompt ${i + 1}...`}
                    className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={loading}
                  />
                </div>
                {prompts.length > 1 && (
                  <button
                    onClick={() => removePrompt(i)}
                    disabled={loading}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors self-end"
                    title="Remove this prompt"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={generateBatch}
            disabled={loading || prompts.filter(p => p.trim()).length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Generating... {progress.current}/{progress.total}
              </span>
            ) : (
              <span>🚀 Generate All ({prompts.filter(p => p.trim()).length} prompts)</span>
            )}
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Results ({results.length})</h3>
            {results.length > 0 && (
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm transition-colors"
              >
                ⬇️ Download All
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
            {results.map((result) => (
              <div key={result.index} className="border rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative group">
                  <img
                    src={`data:image/png;base64,${result.image}`}
                    alt={result.prompt}
                    className="w-full rounded"
                  />
                  {result.cached && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      💾 Cached
                    </div>
                  )}
                </div>
                <p className="text-xs mt-2 text-gray-600 truncate" title={result.prompt}>
                  {result.index + 1}. {result.prompt}
                </p>
                {result.time && (
                  <p className="text-xs text-gray-400">
                    ⏱️ {result.time}ms
                  </p>
                )}
              </div>
            ))}
          </div>

          {loading && results.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Processing your batch...</p>
                <p className="text-sm mt-2">This may take a while</p>
              </div>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <p className="text-4xl mb-2">🇼️</p>
                <p>No results yet</p>
                <p className="text-sm mt-2">Add prompts and click Generate All</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
