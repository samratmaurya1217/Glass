import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  Download, 
  ArrowLeft, 
  Hexagon, 
  LayoutDashboard, 
  Server, 
  Activity, 
  FileJson,
  Cpu,
  Loader2
} from 'lucide-react';
import Button from './Button';

interface ValidationProps {
  portfolioId?: string;
  onBack: () => void;
}

const Validation: React.FC<ValidationProps> = ({ portfolioId = "Unknown", onBack }) => {
  const [step, setStep] = useState<number>(0); // 0=idle, 1=hashing, 2=validating, 3=generating, 4=done
  const [showEvidence, setShowEvidence] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState("no_loans_gt_90_dpd");

  const handleGenerate = () => {
    setStep(1);
    // Simulate multi-step cryptographic process
    setTimeout(() => setStep(2), 1500);
    setTimeout(() => setStep(3), 3000);
    setTimeout(() => setStep(4), 5000);
  };

  const getStepStatus = (currentStep: number, targetStep: number) => {
    if (currentStep > targetStep) return "completed";
    if (currentStep === targetStep) return "active";
    return "pending";
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar (Consistent) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-white">
           <Hexagon className="text-white fill-white/10" strokeWidth={1.5} />
           <span className="font-serif italic font-bold text-xl tracking-tight">GlassVault</span>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          <div className="px-4 py-3 hover:bg-slate-800/50 hover:text-white transition-colors flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Workspace</span>
          </div>
          <div className="px-4 py-3 bg-slate-800 border-r-4 border-blue-500 text-white flex items-center gap-3 cursor-pointer">
            <ShieldCheck size={20} />
            <span className="font-medium">Verify</span>
          </div>
          <div className="px-4 py-3 hover:bg-slate-800/50 hover:text-white transition-colors flex items-center gap-3 cursor-pointer">
            <Server size={20} />
            <span className="font-medium">System Architecture</span>
          </div>
          <div className="px-4 py-3 hover:bg-slate-800/50 hover:text-white transition-colors flex items-center gap-3 cursor-pointer">
            <Activity size={20} />
            <span className="font-medium">System Status</span>
          </div>
        </nav>
        <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
          v2.4.0 (Build 9921)<br/>
          Secure Enclave Active
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-700">Validation & Proof Generation</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Internal Environment</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-64px)]">
          
          {/* Left Panel: Config */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-500" />
                Proof Configuration
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Active Portfolio Context</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm text-gray-700">
                    {portfolioId}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Attestation Claim</label>
                  <select 
                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={selectedClaim}
                    onChange={(e) => setSelectedClaim(e.target.value)}
                    disabled={step > 0 && step < 4}
                  >
                    <option value="no_loans_gt_90_dpd">Assertion: No Loans {'>'} 90 Days Past Due</option>
                    <option value="nav_accuracy">Assertion: NAV Accuracy (within 2% variance)</option>
                    <option value="no_covenant_breach">Assertion: No Covenant Breaches</option>
                  </select>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                  <p className="font-semibold mb-1">Privacy Guarantee</p>
                  <p>GlassVault will generate a Zero-Knowledge Proof (ZKP) locally. No loan-level data leaves this environment.</p>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={step > 0}
                  className="w-full justify-center flex items-center gap-2"
                >
                  {step > 0 && step < 4 ? <Loader2 className="animate-spin w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {step === 0 ? "Generate Cryptographic Proof" : step === 4 ? "Proof Generated" : "Processing..."}
                </Button>
              </div>
            </div>

            {/* Steps Visualization */}
            {step > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step > 1 ? 'bg-green-500 border-green-500 text-white' : step === 1 ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-400'}`}>
                    {step > 1 ? <CheckCircle size={14} /> : '1'}
                  </div>
                  <span className={step >= 1 ? 'text-gray-900' : 'text-gray-400'}>Hashing local dataset Merkle Tree</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step > 2 ? 'bg-green-500 border-green-500 text-white' : step === 2 ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-400'}`}>
                    {step > 2 ? <CheckCircle size={14} /> : '2'}
                  </div>
                  <span className={step >= 2 ? 'text-gray-900' : 'text-gray-400'}>Validating constraints against hashed data</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step > 3 ? 'bg-green-500 border-green-500 text-white' : step === 3 ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-gray-400'}`}>
                    {step > 3 ? <CheckCircle size={14} /> : '3'}
                  </div>
                  <span className={step >= 3 ? 'text-gray-900' : 'text-gray-400'}>Generating zk-SNARK proof artifact</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Output */}
          <div className="flex flex-col h-full">
            {step === 0 && (
              <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Cpu size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Waiting for validation request...</p>
                </div>
              </div>
            )}

            {step > 0 && step < 4 && (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 size={48} className="mx-auto animate-spin text-blue-500" />
                  <p className="text-lg font-medium text-gray-700">
                    {step === 1 ? "Hashing sensitive data..." : step === 2 ? "Running logic circuits..." : "Computing final proof..."}
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex-1 bg-white border border-green-200 rounded-xl p-8 flex flex-col items-center text-center space-y-6 shadow-sm animate-fade-in-up">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2">
                  <ShieldCheck size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Proof Issued Successfully</h3>
                  <p className="text-gray-500 mt-2">The system has cryptographically verified the claim.</p>
                </div>

                <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200 text-left space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Proof ID:</span>
                    <span className="text-gray-900 font-bold">GV-8X992-ZK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Data Root:</span>
                    <span className="text-gray-900 truncate max-w-[200px]">0x7f2a...99b2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Timestamp:</span>
                    <span className="text-gray-900">{new Date().toISOString()}</span>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEvidence(true)}>
                    <FileJson size={18} className="mr-2" />
                    View Evidence
                  </Button>
                  <Button className="flex-1 flex items-center justify-center">
                    <Download size={18} className="mr-2" />
                    Download Pack
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Evidence Modal Overlay */}
      {showEvidence && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileJson size={20} className="text-gray-500" />
                Proof Evidence Artifact
              </h3>
              <button onClick={() => setShowEvidence(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6 overflow-auto bg-gray-50 font-mono text-xs text-gray-800">
              <pre>{JSON.stringify({
                "proof_id": "GV-8X992-ZK",
                "schema": "glassvault-v1",
                "claim": selectedClaim,
                "public_inputs": {
                  "portfolio_hash": "0x7f2a88b9c...",
                  "threshold_date": "2026-02-01",
                  "max_dpd": 90
                },
                "zk_proof": {
                  "a": ["0x123...", "0x456..."],
                  "b": [["0x789...", "0xabc..."], ["0xdef...", "0x012..."]],
                  "c": ["0x345...", "0x678..."]
                },
                "attestation_signature": "0x99aabbcc..."
              }, null, 2)}</pre>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button onClick={() => setShowEvidence(false)} variant="outline">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validation;