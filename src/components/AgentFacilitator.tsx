import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, ChevronDown, Plus, Trash2, Download, Hexagon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LlmProvider, LLM_CONFIGS } from '../types';
import { generatePrd, validatePrd } from '../lib/prd-generator';
import { generateBundle } from '../lib/ralph-generator';
import { downloadBundleZip } from '../lib/zip-export';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormData {
  projectName: string;
  description: string;
  features: string[];
  llmProvider: LlmProvider;
}

interface GeneratedFiles {
  ralphSh: string;
  promptMd: string;
  prdJson: string;
}

export default function AgentFacilitator() {
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    description: '',
    features: [''],
    llmProvider: LlmProvider.CLAUDE_4_5,
  });
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFiles | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  const handleGenerate = () => {
    setErrors([]);

    const nonEmptyFeatures = formData.features.filter(f => f.trim() !== '');

    if (nonEmptyFeatures.length === 0) {
      setErrors(['At least one feature is required']);
      return;
    }

    const prd = generatePrd({
      projectName: formData.projectName,
      description: formData.description,
      features: nonEmptyFeatures,
      llmProvider: formData.llmProvider,
    });

    const validation = validatePrd(prd);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const bundle = generateBundle(prd);
    setGeneratedFiles(bundle);
  };

  const selectedProvider = LLM_CONFIGS[formData.llmProvider];

  return (
    <div className="bg-[#EBEBE8] text-[#18181B] min-h-screen font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
      `}</style>

      {/* Header */}
      <header className="border-b border-stone-300 bg-[#EBEBE8]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hexagon className="w-6 h-6 text-blue-600" />
            <span className="font-bold tracking-tight text-xl">
              <span className="font-serif italic">Agent</span>Facilitator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-stone-400 tracking-widest uppercase">
              RALPH-READY
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-blue-600" />
              <span className="text-xs font-mono uppercase text-blue-600 tracking-widest">
                Bundle Generator
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[0.9] mb-6">
              Generate your
              <br />
              <span className="font-serif italic text-stone-400">Ralph bundle.</span>
            </h1>
            <p className="text-stone-500 max-w-xl font-mono text-sm">
              Configure your AI agent project and generate a complete Ralph bundle
              with prd.json, prompt.md, and ralph.sh ready for autonomous execution.
            </p>
          </div>

          {/* Ralph Wiggum Hero Image */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-stone-200 to-stone-300 rounded-2xl overflow-hidden border border-stone-300 shadow-xl">
              <img
                src="/Ralph.jpeg"
                alt="Ralph Wiggum coding"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                      <div class="text-6xl mb-4">👨‍💻</div>
                      <div class="font-serif italic text-2xl text-stone-600 mb-2">"I'm helping!"</div>
                      <div class="text-xs font-mono text-stone-400">- Ralph Wiggum</div>
                    </div>
                  `;
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 text-xs font-mono uppercase tracking-widest rounded shadow-lg">
              Me fail English? Unpossible!
            </div>
          </div>
        </div>

        {/* How It Works */}
        <section className="mb-16 border border-stone-300 bg-white/60 backdrop-blur-sm p-8 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-px bg-blue-600" />
            <span className="text-xs font-mono uppercase text-blue-600 tracking-widest">
              How It Works
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-4">
                The Ralph pattern,
                <br />
                <span className="font-serif italic text-stone-400">packaged for execution.</span>
              </h2>
              <p className="text-sm font-mono text-stone-500 leading-relaxed">
                This generator assembles a runnable agent bundle: a structured PRD,
                a deterministic prompt, and a loop script that drives an autonomous
                build cycle. The approach is documented in the canonical Ralph write-up
                and clarified by the original collaborators.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest">
                <a
                  href="https://ghuntley.com/ralph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Read the Ralph pattern
                </a>
                <a
                  href="https://x.com/ryancarson/status/2008950489904472501"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Context from Ryan Carson
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    step: '01',
                    title: 'Define the mission',
                    description:
                      'Capture the goal and user stories so the PRD can be generated in a consistent schema.',
                  },
                  {
                    step: '02',
                    title: 'Generate the bundle',
                    description:
                      'Produce `prd.json`, `prompt.md`, and `ralph.sh` with guardrails baked in.',
                  },
                  {
                    step: '03',
                    title: 'Run the loop',
                    description:
                      'Execute the script to iterate story-by-story until the PRD passes.',
                  },
                ].map(item => (
                  <div
                    key={item.step}
                    className="border border-stone-300 bg-white p-5"
                  >
                    <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-3">
                      Step {item.step}
                    </div>
                    <div className="text-lg font-medium mb-2">{item.title}</div>
                    <p className="text-xs font-mono text-stone-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-8">
            {/* LLM Provider Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-3">
                LLM Provider
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-4 bg-white border border-stone-300 text-left flex items-center justify-between hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{selectedProvider.displayName}</div>
                      <div className="text-xs text-stone-400 font-mono">
                        {selectedProvider.modelId}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-stone-400 transition-transform',
                      isDropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-1 bg-white border border-stone-300 shadow-lg"
                  >
                    {Object.values(LlmProvider).map(provider => {
                      const config = LLM_CONFIGS[provider];
                      return (
                        <button
                          key={provider}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, llmProvider: provider }));
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            'w-full p-4 text-left hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0',
                            formData.llmProvider === provider && 'bg-blue-50'
                          )}
                        >
                          <div className="font-medium">{config.displayName}</div>
                          <div className="text-xs text-stone-400 font-mono">
                            {config.description}
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-3">
                Project Name
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={e =>
                  setFormData(prev => ({ ...prev, projectName: e.target.value }))
                }
                placeholder="My Awesome Project"
                className="w-full p-4 bg-white border border-stone-300 placeholder:text-stone-300 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-3">
                Project Description
              </label>
              <textarea
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe what this project will accomplish..."
                rows={3}
                className="w-full p-4 bg-white border border-stone-300 placeholder:text-stone-300 focus:outline-none focus:border-blue-600 transition-colors resize-none"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-500 mb-3">
                Features / User Stories
              </label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={e => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1 p-4 bg-white border border-stone-300 placeholder:text-stone-300 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="p-4 border border-stone-300 hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="w-full p-4 border border-dashed border-stone-300 text-stone-400 hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">
                    Add Feature
                  </span>
                </button>
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700">
                <div className="text-xs font-mono uppercase tracking-widest mb-2">
                  Validation Errors
                </div>
                <ul className="text-sm space-y-1">
                  {errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              className="w-full p-5 bg-blue-600 text-white font-mono text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
            >
              <Download className="w-4 h-4" />
              Generate Bundle
            </button>
          </div>

          {/* Preview */}
          <div>
            <div className="sticky top-24">
              <div className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-3">
                Generated Preview
              </div>
              <div className="bg-stone-900 text-stone-100 p-6 h-[600px] overflow-auto font-mono text-xs">
                {generatedFiles ? (
                  <div className="space-y-6">
                    <div>
                      <div className="text-blue-400 mb-2">// prd.json</div>
                      <pre className="text-stone-400 whitespace-pre-wrap">
                        {generatedFiles.prdJson}
                      </pre>
                    </div>
                    <div className="border-t border-stone-700 pt-6">
                      <div className="text-blue-400 mb-2">// prompt.md</div>
                      <pre className="text-stone-400 whitespace-pre-wrap">
                        {generatedFiles.promptMd}
                      </pre>
                    </div>
                    <div className="border-t border-stone-700 pt-6">
                      <div className="text-blue-400 mb-2">// ralph.sh</div>
                      <pre className="text-stone-400 whitespace-pre-wrap">
                        {generatedFiles.ralphSh}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-stone-600">
                    <div className="text-center">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <div>Configure your project and generate</div>
                      <div className="text-stone-700">to see the preview here.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Download ZIP Button */}
              {generatedFiles && (
                <button
                  type="button"
                  onClick={() =>
                    downloadBundleZip(generatedFiles, formData.projectName)
                  }
                  className="w-full mt-4 p-4 bg-stone-900 text-white font-mono text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-3 border border-stone-700"
                >
                  <Download className="w-4 h-4" />
                  Download ZIP Bundle
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 mt-24 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-mono text-stone-400">
              Powered by the Ralph Pattern
            </div>
            <div className="text-xs font-mono text-stone-400">
              {selectedProvider.displayName} Ready
            </div>
          </div>
          <div className="text-xs font-mono text-stone-400 text-center border-t border-stone-200 pt-4">
            Ralph Pattern by{' '}
            <a
              href="https://x.com/GeoffreyHuntley"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              @GeoffreyHuntley
            </a>
            {' & '}
            <a
              href="https://x.com/ryancarson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              @ryancarson
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
