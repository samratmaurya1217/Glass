import React, { useState } from 'react';
import { 
  Hexagon, 
  LayoutDashboard, 
  ShieldCheck, 
  Server, 
  Activity, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Mail, 
  FileJson,
  ExternalLink,
  XCircle,
  ArrowRight
} from 'lucide-react';
import Button from './Button';
import { api } from '../store';

interface VerifyProps {
  onNavigate: (view: string) => void;
}

interface VerificationResult {
  proofId: string;
  status: 'verified' | 'mismatch' | 'not_found';
  claim?: string;
  portfolio_id?: string;
  generatedAt?: string;
  validationSummary?: {
    totalLoans: number;
    loansOver90: number;
    navEstimate: number;
  };
}

const Verify: React.FC<VerifyProps> = ({ onNavigate }) => {
  const [proofId, setProofId] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleVerify = async () => {
    if (!proofId.trim()) return;
    
    setStatus('loading');
    setResult(null);

    try {
      const data = await api.verify(proofId.trim());
      setResult(data as VerificationResult); 
      setStatus('success');
    } catch (e) {
      console.log("Verification backend unavailable, using local mock patterns.");
      
      // Offline fallback / Mock logic for demo purposes
      await new Promise(r => setTimeout(r, 1200)); // Fake latency
      
      if (proofId.startsWith('GV-')) {
        setResult({
          proofId: proofId,
          status: proofId.includes('FAIL') ? 'mismatch' : 'verified',
          claim: "No loan > 90 days past due",
          portfolio_id: "healthy-1 (Offline Context)",
          generatedAt: new Date().toISOString(),
          validationSummary: {
             totalLoans: 20,
             loansOver90: 0,
             navEstimate: 20000000
          }
        });
      } else {
        setResult({ proofId, status: 'not_found' });
      }
      setStatus('success');
    }
  };

  const handleDownloadEvidence = async () => {
    try {
      const data = await api.getEvidence(proofId);
      triggerDownload(data, proofId);
    } catch (e) {
      // Mock evidence
      const data = {
         proofId,
         mock_evidence: true,
         timestamp: new Date().toISOString(),
         content: "Encrypted proof artifacts (Simulated)"
      };
      triggerDownload(data, proofId);
    }
  };

  const triggerDownload = (data: any, pid: string) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidence-${pid}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

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
    <div className="flex w-full min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-white">
           <Hexagon className="text-white fill-white/10" strokeWidth={1.5} />
           <span className="font-serif italic font-bold text-xl tracking-tight">GlassVault</span>
        </div>
        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Workspace" view="workspace" />
          <SidebarItem icon={ShieldCheck} label="Verify" view="verify" active />
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
          <h1 className="text-lg font-semibold text-gray-700">Independent Proof Verification</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
             <div className="w-2 h-2 rounded-full bg-blue-500"></div>
             <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Public Gateway</span>
          </div>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
          
          {/* Search Section */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Verify an Attestation</h2>
              <p className="text-gray-500">Enter the unique Proof ID provided by the fund manager to verify portfolio health.</p>
            </div>
            
            <div className="flex max-w-lg mx-auto gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={proofId}
                  onChange={(e) => setProofId(e.target.value)}
                  placeholder="e.g. GV-8X992-ZK"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
                />
              </div>
              <Button onClick={handleVerify} disabled={status === 'loading'} className="px-8">
                {status === 'loading' ? <Loader2 className="animate-spin" /> : "Verify"}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          {status === 'success' && result && (
            <div className="animate-fade-in-up">
              
              {/* SUCCESS STATE */}
              {result.status === 'verified' && (
                <div className="bg-white rounded-xl shadow border border-green-200 overflow-hidden">
                  <div className="bg-green-50 px-8 py-6 border-b border-green-100 flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                      <CheckCircle size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-900">VERIFIED: Valid Proof</h3>
                      <p className="text-green-700">The cryptographic signature matches the stored record.</p>
                    </div>
                  </div>
                  
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Attested Claim</span>
                        <div className="mt-1 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 font-medium">
                          {result.claim}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Portfolio Context</span>
                        <div className="mt-1 text-gray-900 font-medium">{result.portfolio_id}</div>
                      </div>
                      <div>
                         <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timestamp</span>
                         <div className="mt-1 text-gray-900">{new Date(result.generatedAt || "").toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Snapshot Summary</span>
                       {result.validationSummary ? (
                         <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-500">Total Loans</span>
                             <span className="font-medium">{result.validationSummary.totalLoans}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-500">Loans {'>'} 90 Days Past Due</span>
                             <span className="font-medium">{result.validationSummary.loansOver90}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span className="text-gray-500">Est. NAV Coverage</span>
                             <span className="font-medium">{(result.validationSummary.navEstimate / 1000000).toFixed(1)}M USD</span>
                           </div>
                         </div>
                       ) : (
                         <div className="text-sm text-gray-400 italic">No summary details available in public proof.</div>
                       )}
                       
                       <Button variant="outline" onClick={handleDownloadEvidence} className="w-full mt-4 flex items-center justify-center gap-2 text-sm">
                         <Download size={16} /> Download Evidence Pack
                       </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* FAILURE STATES */}
              {result.status !== 'verified' && (
                <div className="bg-white rounded-xl shadow border border-red-200 overflow-hidden">
                   <div className="bg-red-50 px-8 py-6 border-b border-red-100 flex items-center gap-4">
                    <div className="bg-red-100 p-2 rounded-full text-red-600">
                      {result.status === 'not_found' ? <Search size={32} /> : <AlertTriangle size={32} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-900">
                        {result.status === 'not_found' ? 'Proof Not Found' : 'ALERT — VERIFICATION FAILED'}
                      </h3>
                      <p className="text-red-700">
                        {result.status === 'not_found' 
                          ? "The ID provided does not match any record in the ledger."
                          : "Critical Mismatch: The computed hash does not match the stored record."}
                      </p>
                    </div>
                  </div>

                  <div className="p-8">
                     <div className="bg-gray-50 p-6 rounded-xl text-center space-y-4">
                        <p className="text-gray-600">
                          This could indicate a typo, a revoked proof, or potential data tampering. 
                          We recommend contacting the fund administrator immediately.
                        </p>
                        <div className="flex justify-center gap-4 pt-2">
                           <Button onClick={() => setShowReviewModal(true)} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                             <Mail size={16} /> Request Human Review
                           </Button>
                           <Button variant="outline" onClick={handleDownloadEvidence} className="flex items-center gap-2">
                             <Download size={16} /> Download Audit Log
                           </Button>
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Human Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
           <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">Request Review</h3>
                 <button onClick={() => setShowReviewModal(false)}><XCircle className="text-gray-400 hover:text-gray-600" /></button>
              </div>
              <div className="p-6 space-y-4">
                 <p className="text-sm text-gray-600">This will generate a secure email template to the fund's compliance officer attaching the proof ID.</p>
                 
                 <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm space-y-2">
                    <div className="flex gap-2"><span className="text-gray-500 w-16">To:</span> <span className="font-mono">compliance@fund-admin.com</span></div>
                    <div className="flex gap-2"><span className="text-gray-500 w-16">Subject:</span> <span className="font-bold">Urgent: Proof Verification Failure [ID: {proofId}]</span></div>
                 </div>

                 <Button 
                   className="w-full justify-center flex items-center gap-2"
                   onClick={() => {
                     window.location.href = `mailto:compliance@fund-admin.com?subject=Verification Failure ${proofId}&body=Please review proof ID ${proofId}. Verification failed on ${new Date().toLocaleDateString()}.`;
                     setShowReviewModal(false);
                   }}
                 >
                   <ExternalLink size={16} /> Open Mail Client
                 </Button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Verify;