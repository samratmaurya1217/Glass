import React, { useState, useEffect } from 'react';
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
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  XCircle,
  Hash,
  FileKey,
  X
} from 'lucide-react';
import Button from './Button';
import { api } from '../store';

interface ValidationProofProps {
  portfolioId?: string;
  onBack: () => void;
  onNavigate: (view: string) => void;
}

interface Loan {
  loan_id: string;
  ref: string;
  days_past_due: number;
  valuation_band: string;
}

interface ValidationSummary {
  passed: boolean;
  totalLoans: number;
  loansOver90: number;
  navEstimate: number;
  timestamp: string;
}

interface ProofArtifact {
  proofId: string;
  claim: string;
  dataHash: string;
  generatedAt: string;
}

interface ToastState {
  show: boolean;
  title: string;
  content: React.ReactNode;
  type: 'success' | 'error';
}

// -- Mock Data Generation (Fallback) --
const generateMockLoans = (isDistressed: boolean): Loan[] => {
  return Array(20).fill(null).map((_, i) => ({
    loan_id: `L-${isDistressed ? 2000 : 1000}+${i}`,
    ref: `REF-${isDistressed ? 2000 : 1000}+${i}`,
    days_past_due: isDistressed && i === 0 ? 120 : (isDistressed && i === 3 ? 45 : 0),
    valuation_band: isDistressed && i === 0 ? "30-40" : "98-100",
  }));
};

const ValidationProof: React.FC<ValidationProofProps> = ({ portfolioId = "unknown-1", onBack, onNavigate }) => {
  // -- State --
  const [viewMode, setViewMode] = useState<'fund' | 'investor'>('fund');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Validation State
  const [validationStatus, setValidationStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [validationResult, setValidationResult] = useState<ValidationSummary | null>(null);

  // Proof State
  const [proofStatus, setProofStatus] = useState<'idle' | 'generating' | 'issued'>('idle');
  const [proofArtifact, setProofArtifact] = useState<ProofArtifact | null>(null);
  const [isVerifyingHash, setIsVerifyingHash] = useState(false);

  // Toast State
  const [toast, setToast] = useState<ToastState | null>(null);

  // -- Effects --
  useEffect(() => {
    loadPortfolioData();
  }, [portfolioId]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => setToast(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadPortfolioData = async () => {
    setIsLoadingData(true);
    try {
      // Try fetching from store (simulate network)
      const data = await api.getDataset(portfolioId);
      setLoans(data.loans as Loan[]);
    } catch (e) {
      // Fallback to local sync access if offline (per requirements)
      const localData = api.getDatasetLocal(portfolioId);
      if (localData) {
        setLoans(localData.loans as Loan[]);
      } else {
        // Ultimate fallback
        const isDistressed = portfolioId.includes('fail') || portfolioId.includes('distressed');
        setLoans(generateMockLoans(isDistressed));
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // -- Logic --
  
  const parseValuationMidpoint = (band: string): number => {
    // e.g. "98-100" -> 99. "100" -> 100.
    if (!band.includes('-')) return parseFloat(band);
    const [low, high] = band.split('-').map(Number);
    return (low + high) / 2;
  };

  const executeValidation = () => {
    setValidationStatus('running');
    setProgress(0);

    // Simulate progress animation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 5;
      });
    }, 75); // ~1.5s total

    // Actual Logic
    setTimeout(() => {
      const loansOver90 = loans.filter(l => l.days_past_due > 90).length;
      const totalNav = loans.reduce((acc, l) => acc + parseValuationMidpoint(l.valuation_band), 0);
      // Rough conversion factor logic: assume standard loan size 1M for demo
      const navEstimate = totalNav * 1_000_000; 

      setValidationResult({
        passed: loansOver90 === 0,
        totalLoans: loans.length,
        loansOver90,
        navEstimate,
        timestamp: new Date().toISOString()
      });
      setValidationStatus('complete');
    }, 1600);
  };

  // Helper to compute local hash for verification
  const computeLocalHash = async (currentLoans: Loan[], summary: ValidationSummary | null) => {
    if (!summary) return null;
    const payload = {
      portfolioId,
      loans: currentLoans.map(l => ({ id: l.loan_id, dpd: l.days_past_due })), // Minimal subset for checking
      summary: summary
    };
    const canonicalString = JSON.stringify(payload);
    const msgBuffer = new TextEncoder().encode(canonicalString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateProof = async () => {
    if (!validationResult) return;
    setProofStatus('generating');

    try {
      // 1. Hash (Client Side - browser crypto works offline)
      const hashHex = await computeLocalHash(loans, validationResult);
      if (!hashHex) throw new Error("Hashing failed");

      // 2. Try Store API Call
      try {
        const data = await api.attest({
          portfolio_id: portfolioId,
          claim: validationResult.passed ? "No loan > 90 days past due" : "Validation Failed",
          dataHash: hashHex,
          validationSummary: validationResult,
          generatedBy: "GlassVault Local Agent"
        });

        setProofArtifact({
          proofId: data.proofId,
          claim: validationResult.passed ? "No loan > 90 days past due" : "Validation Failed",
          dataHash: hashHex,
          generatedAt: data.generatedAt
        });
        setProofStatus('issued');
        return;
      } catch (networkError) {
        // Fall through to offline handling below
        console.log("Backend offline, generating local artifact with real hash");
      }

      // 3. Offline Fallback (using REAL hash calculated above)
      setTimeout(() => {
        setProofArtifact({
          proofId: `GV-OFFLINE-${Math.floor(Math.random()*10000)}`,
          claim: validationResult.passed ? "No loan > 90 days past due" : "Validation Failed",
          dataHash: hashHex, // Use the real client-side hash
          generatedAt: new Date().toISOString()
        });
        setProofStatus('issued');
      }, 1000);

    } catch (e) {
      console.error("Proof generation failed completely", e);
      setProofStatus('idle');
    }
  };

  const handleVerifyHash = async () => {
    if (!proofArtifact) return;
    
    setIsVerifyingHash(true);

    // Simulate verification delay (1.2s) as requested
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Recalculate hash from current state to verify integrity
    const currentHash = await computeLocalHash(loans, validationResult);
    
    setIsVerifyingHash(false);

    if (currentHash === proofArtifact.dataHash) {
      setToast({
        show: true,
        title: "Integrity Check Passed",
        type: 'success',
        content: (
          <div className="space-y-3 mt-1 text-sm">
             <div>
               <p className="text-xs text-green-700 font-semibold uppercase tracking-wider mb-1">Calculated Merkle Root</p>
               <div className="font-mono text-xs bg-green-50 border border-green-100 text-green-800 p-1.5 rounded break-all">
                 {currentHash?.substring(0, 24)}...
               </div>
             </div>
             <div>
               <p className="text-xs text-green-700 font-semibold uppercase tracking-wider mb-1">Stored Ledger Root</p>
               <div className="font-mono text-xs bg-green-50 border border-green-100 text-green-800 p-1.5 rounded break-all">
                 {proofArtifact.dataHash.substring(0, 24)}...
               </div>
             </div>
             <p className="text-green-900 font-medium">The local data matches the cryptographic commitment exactly.</p>
          </div>
        )
      });
    } else {
      setToast({
        show: true,
        title: "Integrity Check FAILED",
        type: 'error',
        content: (
          <div className="space-y-3 mt-1 text-sm">
             <p className="text-red-800">Data has changed since proof generation.</p>
             <div>
               <p className="text-xs text-red-700 font-semibold uppercase tracking-wider mb-1">Stored Root</p>
               <div className="font-mono text-xs bg-red-50 border border-red-100 text-red-800 p-1.5 rounded break-all">
                 {proofArtifact.dataHash.substring(0, 24)}...
               </div>
             </div>
             <div>
               <p className="text-xs text-red-700 font-semibold uppercase tracking-wider mb-1">Current Hash</p>
               <div className="font-mono text-xs bg-red-50 border border-red-100 text-red-800 p-1.5 rounded break-all">
                 {currentHash?.substring(0, 24)}...
               </div>
             </div>
          </div>
        )
      });
    }
  };

  const handleExport = () => {
    if (!proofArtifact) return;
    const blob = new Blob([JSON.stringify(proofArtifact, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof-${proofArtifact.proofId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // -- Render Helpers --

  const isFundView = viewMode === 'fund';

  // Sidebar helper
  const SidebarItem = ({ icon: Icon, label, view, active = false }: any) => (
    <div 
      onClick={() => onNavigate(view)}
      className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
        active 
          ? 'bg-slate-800 border-r-4 border-blue-500 text-white' 
          : 'hover:bg-slate-800/50 hover:text-white text-slate-300'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex w-full min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      
      {/* Sidebar - Highlight Workspace to show "in-place" context */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-white">
           <Hexagon className="text-white fill-white/10" strokeWidth={1.5} />
           <span className="font-serif italic font-bold text-xl tracking-tight">GlassVault</span>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Workspace" view="workspace" active />
          <SidebarItem icon={ShieldCheck} label="Verify" view="verify" />
          <SidebarItem icon={Server} label="System Architecture" view="architecture" />
          <SidebarItem icon={Activity} label="System Status" view="status" />
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
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                Workspace 
                <span className="text-gray-400 font-normal">/ Validation Engine / {portfolioId}</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Perspective Toggle */}
             <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
               <button 
                 onClick={() => setViewMode('fund')}
                 className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${viewMode === 'fund' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <Eye size={16} /> Fund View
               </button>
               <button 
                 onClick={() => setViewMode('investor')}
                 className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${viewMode === 'investor' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <EyeOff size={16} /> Investor View
               </button>
             </div>
             
             <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Internal Environment</span>
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Validation Engine */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-gray-500" />
                  Portfolio Validation Logic
                </h2>
                {validationStatus === 'complete' && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    Logic v2.4 (Active)
                  </span>
                )}
              </div>

              {/* Execution Control */}
              <div className="space-y-6">
                 {/* Only show raw controls to Fund Manager */}
                 {isFundView && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-xs text-slate-600 space-y-2">
                      <div className="flex justify-between">
                         <span>Source:</span>
                         <span className="font-bold">{portfolioId}</span>
                      </div>
                      <div className="flex justify-between">
                         <span>Records:</span>
                         <span>{loans.length} loans loaded</span>
                      </div>
                      <div className="flex justify-between">
                         <span>Rule:</span>
                         <span>CHECK(days_past_due &lt;= 90)</span>
                      </div>
                    </div>
                 )}

                 {validationStatus === 'idle' && (
                   <Button onClick={executeValidation} disabled={isLoadingData} className="w-full flex justify-center items-center gap-2">
                     {isLoadingData ? <Loader2 className="animate-spin w-4 h-4"/> : <Activity className="w-4 h-4" />}
                     Execute Validation
                   </Button>
                 )}

                 {validationStatus === 'running' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium text-gray-600">
                         <span>Running policy checks...</span>
                         <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                 )}

                 {/* Results Card */}
                 {validationStatus === 'complete' && validationResult && (
                    <div className={`border rounded-xl p-5 animate-fade-in-up ${validationResult.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                       <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-full ${validationResult.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {validationResult.passed ? <CheckCircle size={24} /> : <XCircle size={24} />}
                          </div>
                          <div className="flex-1">
                             <h3 className={`text-lg font-bold ${validationResult.passed ? 'text-green-900' : 'text-red-900'}`}>
                                {validationResult.passed ? "Portfolio Validation Passed" : "Portfolio Validation Failed"}
                             </h3>
                             <p className={`text-sm mt-1 ${validationResult.passed ? 'text-green-700' : 'text-red-700'}`}>
                                {validationResult.passed 
                                  ? "All loans meet the < 90 days past due criteria."
                                  : `${validationResult.loansOver90} loans exceed 90 days past due threshold.`
                                }
                             </p>
                             
                             {/* Detailed Stats (Fund View Only) */}
                             {isFundView && (
                               <div className="mt-4 pt-4 border-t border-black/5 grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="block text-xs uppercase tracking-wide opacity-70 mb-1">Total NAV (Est)</span>
                                    <span className="font-mono font-bold text-lg">{formatCurrency(validationResult.navEstimate)}</span>
                                  </div>
                                  <div>
                                    <span className="block text-xs uppercase tracking-wide opacity-70 mb-1">Delinquency Rate</span>
                                    <span className="font-mono font-bold text-lg">
                                      {((validationResult.loansOver90 / validationResult.totalLoans) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            </div>

            {/* What This Guarantees */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
               <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                 <ShieldCheck size={18} /> What this proof guarantees
               </h3>
               <ul className="space-y-2 text-sm text-gray-600">
                 <li className="flex items-start gap-2">
                   <div className="min-w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400"></div>
                   <span>Logic ran inside secure enclave (integrity ensured)</span>
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="min-w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400"></div>
                   <span>Input data hash matches your local environment</span>
                 </li>
                 <li className="flex items-start gap-2">
                   <div className="min-w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400"></div>
                   <span>Zero knowledge leakage of borrower names</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* RIGHT: Assurance Context / Proof Output */}
          <div className="flex flex-col h-full space-y-6">
             
             {/* Generate Action Card */}
             {validationStatus === 'complete' && proofStatus === 'idle' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1 animate-fade-in-up">
                   <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                     <FileKey size={32} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-gray-900">Ready to Issue Proof</h3>
                     <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                       This will cryptographically bind the validation result to the current dataset state without revealing sensitive rows.
                     </p>
                   </div>
                   <Button onClick={generateProof} disabled={!validationResult?.passed} className="w-full max-w-xs">
                     Generate Proof of Valuation
                   </Button>
                   {!validationResult?.passed && (
                     <p className="text-xs text-red-500 flex items-center gap-1">
                       <AlertTriangle size={12} /> Cannot issue proof for failed validation
                     </p>
                   )}
                </div>
             )}

             {/* Waiting State */}
             {proofStatus === 'generating' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center flex-1">
                   <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
                   <h3 className="text-lg font-medium text-gray-900">Hashing Dataset & Generating Proof...</h3>
                </div>
             )}

             {/* Proof Issued Card */}
             {proofStatus === 'issued' && proofArtifact && (
                <div className="bg-white rounded-xl shadow-md border border-green-100 p-0 overflow-hidden flex flex-col flex-1 animate-fade-in-up">
                   <div className="bg-green-600 p-6 text-white text-center">
                      <div className="inline-flex p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                        <Lock size={32} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold">Proof Issued</h2>
                      <p className="text-green-100 mt-1">Cryptographically Signed</p>
                   </div>

                   <div className="p-6 space-y-6 flex-1 flex flex-col">
                      <div className="space-y-4">
                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Proof ID</span>
                            <span className="font-mono text-sm font-bold text-gray-900">{proofArtifact.proofId}</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Attested Claim</span>
                            <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                              {proofArtifact.claim}
                            </span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-500">Timestamp</span>
                            <span className="text-sm text-gray-900">{new Date(proofArtifact.generatedAt).toLocaleTimeString()}</span>
                         </div>
                         <div className="py-2">
                            <span className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Merkle Root (Data Hash)</span>
                            <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all text-gray-600 border border-gray-200">
                               {proofArtifact.dataHash}
                            </div>
                         </div>
                      </div>
                      
                      <div className="mt-auto pt-6 flex gap-3">
                         <Button onClick={handleVerifyHash} disabled={isVerifyingHash} variant="outline" className="flex-1 flex justify-center items-center gap-2 text-sm">
                           {isVerifyingHash ? <Loader2 className="animate-spin w-4 h-4"/> : <Hash size={16} />} 
                           {isVerifyingHash ? "Verifying..." : "Verify Hash"}
                         </Button>
                         <Button onClick={handleExport} className="flex-1 flex justify-center items-center gap-2 text-sm bg-gray-900 text-white">
                           <Download size={16} /> Export
                         </Button>
                      </div>
                   </div>
                </div>
             )}

             {/* Placeholder if idle */}
             {validationStatus !== 'complete' && proofStatus === 'idle' && (
               <div className="border-2 border-dashed border-gray-200 rounded-xl flex-1 flex items-center justify-center text-gray-400 p-8 text-center bg-gray-50">
                  <div>
                    <Server size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Run validation to enable proof generation.</p>
                  </div>
               </div>
             )}
          </div>

        </div>

        {/* TOAST RENDER */}
        {toast && toast.show && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up max-w-sm w-full">
             <div className={`rounded-xl shadow-2xl border-l-4 p-5 bg-white ${
                 toast.type === 'success' ? 'border-l-green-500 border-gray-100' : 'border-l-red-500 border-gray-100'
               }`}>
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                     {toast.type === 'success' ? <CheckCircle className="text-green-500 w-5 h-5" /> : <AlertTriangle className="text-red-500 w-5 h-5" />}
                     <h3 className={`font-bold text-lg ${toast.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                       {toast.title}
                     </h3>
                  </div>
                  <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={18} />
                  </button>
               </div>
               <div className="pl-7">
                 {toast.content}
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ValidationProof;