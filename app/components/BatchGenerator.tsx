'use client';

import { useState } from 'react';

export default function BatchGenerator() {
  const [prompts, setPrompts] = useState<string[]>(['', '', '']);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const updatePrompt = (index: number, value: string) => {
    const updated = [...prompts];
    updated[index] = value;
    setPrompts(updated);
  };

  const addPrompt = () => setPrompts([...prompts, '']);
  
  const removePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const generateBatch = async () => {
    const validPrompts = prompts.filter(p => p.trim());
    if (validPrompts.length === 0) return;

    setLoading(true);
    setResults([]);
    setProgress({ current: 0, total: validPrompts.length });

    try {
      const response = await fetch('/api/batch-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompts: validPrompts })
      });

      const data = await response.json();
      setResults(data.results);
      setProgress({ current: data.successful, total: data.total });
    } catch (error) {
      console.error(error);
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
        <p className="text-gray-600">Generate multiple images at once (Max 10)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Prompts ({prompts.length}/10)</h3>
            <button
              onClick={addPrompt}
              disabled={prompts.length >= 10}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              + Add Prompt
            </button>
          </div>

          {prompts.map((prompt, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={prompt}
                onChange={(e) => updatePrompt(i, e.target.value)}
                placeholder={`Prompt ${i + 1}`}
                className="flex-1 p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {prompts.length > 1 && (
                <button
                  onClick={() => removePrompt(i)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            onClick={generateBatch}
            disabled={loading || prompts.filter(p => p.trim()).length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all shadow-lg"
          >
            {loading ? `Generating... ${progress.current}/${progress.total}` : '🚀 Generate All'}
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Results ({results.length})</h3>
          
          {results.length > 0 && (
            <button
              onClick={downloadAll}
              className="w-full mb-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              ⬇️ Download All
            </button>
          )}

          <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
            {results.map((result) => (
              <div key={result.index} className="border rounded-lg p-2 bg-white shadow-sm">
                <img
                  src={`data:image/png;base64,${result.image}`}
                  alt={result.prompt}
                  className="w-full rounded"
                />
                <p className="text-xs mt-2 text-gray-600 truncate" title={result.prompt}>
                  {result.prompt}
                </p>
              </div>
            ))}
          </div>

          {loading && results.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Processing your batch...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
