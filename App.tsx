
import React, { useState, useCallback } from 'react';
import { AppState, ProductType, MockupResult } from './types';
import LogoUploader from './components/LogoUploader';
import ProductSelector from './components/ProductSelector';
import Editor from './components/Editor';
import { generateMockup, editMockup } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    logo: null,
    selectedProduct: null,
    results: [],
    isGenerating: false,
    error: null,
  });

  const [currentViewId, setCurrentViewId] = useState<string | null>(null);

  const handleLogoUpload = (logo: string) => {
    setState(prev => ({ ...prev, logo }));
  };

  const handleProductSelect = (product: ProductType) => {
    setState(prev => ({ ...prev, selectedProduct: product }));
  };

  const handleGenerate = async () => {
    if (!state.logo || !state.selectedProduct) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const imageUrl = await generateMockup(state.logo, state.selectedProduct.promptHint);
      const newResult: MockupResult = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        timestamp: Date.now(),
        prompt: state.selectedProduct.promptHint,
        productType: state.selectedProduct.name,
      };
      
      setState(prev => ({
        ...prev,
        results: [newResult, ...prev.results],
        isGenerating: false,
      }));
      setCurrentViewId(newResult.id);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isGenerating: false }));
    }
  };

  const handleEdit = async (prompt: string) => {
    if (!currentViewId) return;
    const currentResult = state.results.find(r => r.id === currentViewId);
    if (!currentResult) return;

    setState(prev => ({ ...prev, isGenerating: true }));

    try {
      const newImageUrl = await editMockup(currentResult.url, prompt);
      const updatedResults = state.results.map(r => 
        r.id === currentViewId ? { ...r, url: newImageUrl, timestamp: Date.now() } : r
      );
      
      setState(prev => ({
        ...prev,
        results: updatedResults,
        isGenerating: false,
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, isGenerating: false }));
    }
  };

  const handleExport = () => {
    const current = state.results.find(r => r.id === currentViewId);
    if (!current) return;
    
    const link = document.createElement('a');
    link.href = current.url;
    link.download = `merch-mockup-${current.productType}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeMockup = state.results.find(r => r.id === currentViewId);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight">MerchAI</h1>
          </div>

          <LogoUploader onUpload={handleLogoUpload} currentLogo={state.logo} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
            Select Product
          </label>
          <ProductSelector 
            onSelect={handleProductSelect} 
            selectedId={state.selectedProduct?.id} 
          />

          <button
            onClick={handleGenerate}
            disabled={!state.logo || !state.selectedProduct || state.isGenerating}
            className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {state.isGenerating ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <i className="fa-solid fa-plus"></i>
            )}
            Generate Mockup
          </button>

          {state.error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-xs">
              {state.error}
            </div>
          )}

          <div className="mt-8">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 block">
              Recent Work
            </label>
            <div className="space-y-3">
              {state.results.map(res => (
                <button
                  key={res.id}
                  onClick={() => setCurrentViewId(res.id)}
                  className={`w-full p-2 rounded-lg border flex items-center gap-3 transition-all ${
                    currentViewId === res.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-800 hover:border-slate-700 bg-slate-800/20'
                  }`}
                >
                  <img src={res.url} className="w-12 h-12 object-cover rounded" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200">{res.productType}</p>
                    <p className="text-[10px] text-slate-500">{new Date(res.timestamp).toLocaleTimeString()}</p>
                  </div>
                </button>
              ))}
              {state.results.length === 0 && (
                <p className="text-xs text-slate-600 italic">No mockups yet</p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-8 overflow-hidden relative">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Preview & Editor</h2>
            <p className="text-slate-400">Design and iterate your merchandise in real-time.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-slate-950" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                +12
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 relative">
          {activeMockup ? (
            <Editor 
              imageUrl={activeMockup.url} 
              onEdit={handleEdit} 
              isEditing={state.isGenerating}
              onExport={handleExport}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              {state.isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-slate-400 animate-pulse font-medium">Generating your first mockup...</p>
                </div>
              ) : (
                <div className="text-center max-w-sm px-6">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-palette text-3xl text-slate-600"></i>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Design?</h3>
                  <p className="text-slate-500 text-sm">
                    Upload a logo and choose a product on the left to start generating your custom merchandise shots.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Tips */}
        <div className="absolute bottom-12 right-12">
           <div className="bg-blue-600/10 border border-blue-500/20 backdrop-blur-md p-4 rounded-xl max-w-xs shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-lightbulb text-blue-400 text-sm"></i>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Pro Tip</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Use text prompts like <span className="text-blue-400">"Make the lighting more dramatic"</span> or <span className="text-blue-400">"Add a beach background"</span> to refine your mockups.
              </p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
