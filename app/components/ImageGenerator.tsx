'use client';

import { useState, useRef } from 'react';
import { STYLE_PRESETS, applyStylePreset } from '@/lib/stylePresets';
import { PromptOptimizer } from '@/lib/promptOptimizer';

interface GenerationSettings {
  width: number;
  height: number;
  num_steps: number;
  guidance: number;
  seed?: number;
  optimize: boolean;
  useCache: boolean;
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [cacheHit, setCacheHit] = useState(false);
  
  const [settings, setSettings] = useState<GenerationSettings>({
    width: 1024,
    height: 1024,
    num_steps: 4,
    guidance: 3.5,
    optimize: true,
    useCache: true
  });

  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const PROMPT_EXAMPLES = [
    'A cyberpunk cat wearing sunglasses in neon-lit Tokyo streets',
    'A magical forest with glowing crystals and fairy lights',
    'Professional portrait of a businesswoman in modern office',
    'Product photo of luxury watch on marble surface',
    'Anime girl with blue hair in cherry blossom garden',
    'Minimalist logo design for tech startup',
    'Vintage photograph of old European street',
    'Futuristic spaceship interior with holographic displays'
  ];

  const generate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImage(null);
    setGenerationTime(null);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/generate-cached', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...settings })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);

      const genTime = response.headers.get('X-Generation-Time');
      const cache = response.headers.get('X-Cache');
      
      if (genTime) {
        setGenerationTime(parseInt(genTime));
      } else {
        setGenerationTime(Date.now() - startTime);
      }
      
      setCacheHit(cache === 'HIT');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (image && downloadRef.current) {
      downloadRef.current.href = image;
      downloadRef.current.download = `flux2-${Date.now()}.png`;
      downloadRef.current.click();
    }
  };

  const applyPreset = (presetKey: string) => {
    const result = applyStylePreset(prompt, presetKey as any);
    setPrompt(result.prompt);
    setSettings(prev => ({
      ...prev,
      width: result.width,
      height: result.height,
      num_steps: result.num_steps,
      guidance: result.guidance
    }));
    setSelectedPreset(presetKey);
  };

  const optimizePrompt = () => {
    const optimized = PromptOptimizer.optimize(prompt);
    setPrompt(optimized.optimized);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          FLUX.2 Pro Generator
        </h1>
        <p className="text-gray-600">Powered by Cloudflare Workers AI • Advanced Features Enabled</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-3">🎨 Style Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key)}
                  className={`p-2 text-sm rounded border transition-all ${
                    selectedPreset === key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                  title={preset.description}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-3">💡 Examples</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {PROMPT_EXAMPLES.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between font-semibold mb-2"
            >
              <span>⚙️ Advanced Settings</span>
              <span>{showAdvanced ? '▼' : '▶'}</span>
            </button>
            
            {showAdvanced && (
              <div className="space-y-3 mt-3">
                <div>
                  <label className="text-xs font-medium block mb-1">
                    Size: {settings.width}×{settings.height}
                  </label>
                  <select
                    value={`${settings.width}x${settings.height}`}
                    onChange={(e) => {
                      const [w, h] = e.target.value.split('x').map(Number);
                      setSettings({...settings, width: w, height: h});
                    }}
                    className="w-full p-2 text-sm border rounded"
                  >
                    <option value="512x512">512×512 (Fast)</option>
                    <option value="768x768">768×768</option>
                    <option value="1024x1024">1024×1024 (Best)</option>
                    <option value="768x1024">768×1024 (Portrait)</option>
                    <option value="1024x768">1024×768 (Landscape)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">
                    Quality Steps: {settings.num_steps}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={settings.num_steps}
                    onChange={(e) => setSettings({...settings, num_steps: Number(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Fast</span>
                    <span>Quality</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">
                    Guidance: {settings.guidance.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={0.1}
                    value={settings.guidance}
                    onChange={(e) => setSettings({...settings, guidance: Number(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.optimize}
                      onChange={(e) => setSettings({...settings, optimize: e.target.checked})}
                    />
                    Auto-optimize prompt
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={settings.useCache}
                      onChange={(e) => setSettings({...settings, useCache: e.target.checked})}
                    />
                    Use cache (faster)
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium mb-2">✍️ Your Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your image in detail..."
              className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={loading}
            />
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Generating...
                  </span>
                ) : '🚀 Generate Image'}
              </button>
              
              <button
                onClick={optimizePrompt}
                disabled={loading || !prompt.trim()}
                className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
              >
                ✨ Optimize
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-700 font-medium">Generation Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {image && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <img
                  src={image}
                  alt="Generated"
                  className="w-full rounded-lg shadow-xl"
                />
                
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs space-y-1">
                  {generationTime && (
                    <div>⏱️ {generationTime}ms</div>
                  )}
                  {cacheHit && (
                    <div>💾 Cached</div>
                  )}
                  <div>📏 {settings.width}×{settings.height}</div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ⬇️ Download
                </button>
                <button
                  onClick={() => setImage(null)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  🗑️ Clear
                </button>
                <button
                  onClick={() => generate()}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔄 Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <a ref={downloadRef} className="hidden" />
    </div>
  );
}
