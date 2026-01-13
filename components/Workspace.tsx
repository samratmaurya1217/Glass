import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Server, 
  Activity, 
  Hexagon, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Database,
  ArrowRight,
  AlertTriangle,
  Loader2,
  WifiOff
} from 'lucide-react';
import Button from './Button';
import { api } from '../store';

// -- Types --
interface Loan {
  loan_id: string;
  ref: string;
  days_past_due: number;
  valuation_band: string;
  covenant_flags: string[];
  payment_history_summary: string;
  redacted_borrower_id: string;
}

interface DatasetSummary {
  id: string;
  name: string;
  asOf: string;
  loans: number;
}

interface FullDataset {
  portfolio_id: string;
  as_of: string;
  loans: Loan[];
}

interface WorkspaceProps {
  onNavigate: (view: string, portfolioId?: string) => void;
}

// -- Mock Data for Offline Fallback --
const MOCK_DATASETS: DatasetSummary[] = [
  { id: 'healthy-1', name: 'Healthy Portfolio (Alpha)', asOf: '2026-02-01', loans: 20 },
  { id: 'fail-1', name: 'Distressed Debt Fund II (Beta)', asOf: '2026-02-01', loans: 20 }
];

const Workspace: React.FC<WorkspaceProps> = ({ onNavigate }) => {
  // -- State --
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [ingestedData, setIngestedData] = useState<FullDataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState<'normal' | 'distressed'>('normal');
  const [isOffline, setIsOffline] = useState(false);

  // Checklist State (steps: 0=pending, 1=loading, 2=done, 3=error/warn)
  const [checklist, setChecklist] = useState({
    completeness: 0,
    recency: 0,
    covenant: 0,
    valuation: 0
  });

  const fetchDatasets = async () => {
    try {
      // Use local API simulation
      const data = await api.getDatasets();
      
      setDatasets(data);
      setIsOffline(false);
      // No auto-selection on load - user must explicitly select
    } catch (err) {
      console.log("GlassVault Backend unavailable (Offline Mode activated)");
      setIsOffline(true);
      setDatasets(MOCK_DATASETS);
      // No auto-selection on load - user must explicitly select
    }
  };

  // -- Effects --
  useEffect(() => {
    fetchDatasets();
  }, []);

  // -- Handlers --

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedDatasetId(newId);
    // Reset readiness checklist when portfolio changes
    setChecklist({ completeness: 0, recency: 0, covenant: 0, valuation: 0 });
    setIngestedData(null);
  };

  const handleIngest = async () => {
    if (!selectedDatasetId) return;

    setIsLoading(true);
    setIngestedData(null);
    setChecklist({ completeness: 0, recency: 0, covenant: 0, valuation: 0 });

    try {
      let data: FullDataset;
      
      // If we are already offline, use local lookup directly
      if (isOffline) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const localData = api.getDatasetLocal(selectedDatasetId);
        if (!localData) throw new Error("Local data missing");
        data = localData as unknown as FullDataset;
      } else {
        // Try network fetch (simulated)
        const result = await api.getDataset(selectedDatasetId);
        data = result as unknown as FullDataset;
      }
      
      // Simulate checking animation
      setTimeout(() => {
        setIsLoading(false);
        setIngestedData(data);
        runReadinessChecks(data);
      }, 500);
      
    } catch (error) {
      console.log("Ingestion unavailable online, switching to local simulation.");
      setIsLoading(false);
      setIsOffline(true);
      
      // Fallback to offline local data access
      const localData = api.getDatasetLocal(selectedDatasetId);
      if (localData) {
        setIngestedData(localData as unknown as FullDataset);
        runReadinessChecks(localData as unknown as FullDataset);
      }
    }
  };

  const runReadinessChecks = (data: FullDataset) => {
    // Animate checklist items sequentially
    const isDistressed = data.portfolio_id.includes('distressed') || data.portfolio_id.includes('fail');

    setTimeout(() => setChecklist(prev => ({ ...prev, completeness: 1 })), 100);
    setTimeout(() => setChecklist(prev => ({ ...prev, completeness: 2 })), 600); // Always complete in mock

    setTimeout(() => setChecklist(prev => ({ ...prev, recency: 1 })), 800);
    setTimeout(() => setChecklist(prev => ({ ...prev, recency: 2 })), 1400); 

    setTimeout(() => setChecklist(prev => ({ ...prev, covenant: 1 })), 1600);
    setTimeout(() => setChecklist(prev => ({ ...prev, covenant: isDistressed ? 3 : 2 })), 2200); // Warn if distressed

    setTimeout(() => setChecklist(prev => ({ ...prev, valuation: 1 })), 2400);
    setTimeout(() => setChecklist(prev => ({ ...prev, valuation: 2 })), 3000); 
  };

  const getStatusIcon = (status: number) => {
    if (status === 0) return <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>; // Pending
    if (status === 1) return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />; // Loading
    if (status === 2) return <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />; // Success
    if (status === 3) return <AlertCircle className="w-5 h-5 text-amber-500 fill-amber-50" />; // Warning
    return null;
  };

  const getRowStyle = (loan: Loan) => {
    if (loan.days_past_due > 90) return "bg-red-50 hover:bg-red-100";
    if (loan.covenant_flags.length > 0) return "bg-amber-50 hover:bg-amber-100";
    return "hover:bg-gray-50";
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-white">
           <Hexagon className="text-white fill-white/10" strokeWidth={1.5} />
           <span className="font-serif italic font-bold text-xl tracking-tight">GlassVault</span>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <div className="px-4 py-3 bg-slate-800 border-r-4 border-blue-500 text-white flex items-center gap-3 cursor-pointer">
            <LayoutDashboard size={20} />
            <span className="font-medium">Workspace</span>
          </div>
          <div 
            onClick={() => onNavigate('verify')}
            className="px-4 py-3 hover:bg-slate-800/50 hover:text-white transition-colors flex items-center gap-3 cursor-pointer text-slate-300"
          >
            <ShieldCheck size={20} />
            <span className="font-medium">Verify</span>
          </div>
          <div 
            onClick={() => onNavigate('architecture')}
            className="px-4 py-3 hover:bg-slate-800/50 hover:text-white transition-colors flex items-center gap-3 cursor-pointer text-slate-300"
          >
            <Server size={20} />
            <span className="font-medium">System Architecture</span>
          </div>
          <div 
            onClick={() => onNavigate('status')}
            className="px-4 py-3 hover:bg-slate-800/50 hover:text-white transition-colors flex items-center gap-3 cursor-pointer text-slate-300"
          >
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
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-700">Portfolio Assurance Workspace</h1>
            {isOffline && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium animate-fade-in-up">
                <WifiOff className="w-3 h-3" /> Offline Validation
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isOffline ? 'bg-amber-500' : 'bg-green-500'}`}></div>
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Internal Environment</span>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Top Section: Controls & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. Control Panel */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-gray-500" />
                    Portfolio Source
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Scenario Selector */}
                  <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
                    <button 
                      onClick={() => setScenario('normal')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${scenario === 'normal' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Normal Scenario
                    </button>
                    <button 
                      onClick={() => setScenario('distressed')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${scenario === 'distressed' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Missed Payment Detected
                    </button>
                  </div>

                  {/* Dataset Selector & Ingest */}
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Dataset Source</label>
                      <div className="relative">
                        <select 
                          value={selectedDatasetId}
                          onChange={handlePortfolioChange}
                          disabled={datasets.length === 0}
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900 disabled:opacity-50"
                        >
                          <option value="" disabled>
                            Select a portfolio…
                          </option>
                          {datasets.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.name} — {d.loans} Loans ({d.asOf})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                          <ArrowRight size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleIngest} 
                      disabled={isLoading || !selectedDatasetId}
                      className="h-[42px] px-6 py-0 flex items-center gap-2 whitespace-nowrap"
                    >
                      {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      {isLoading ? 'Ingesting...' : 'Ingest Portfolio Export'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Bar (Only visible if ingested) */}
              {ingestedData && (
                <div className="flex justify-end animate-fade-in-up">
                  <Button 
                    onClick={() => onNavigate('validation', ingestedData.portfolio_id)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-md"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Run Portfolio Validation
                  </Button>
                </div>
              )}
            </div>

            {/* 2. Readiness Checks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Readiness Checklist</h3>
              <div className="space-y-5 flex-1">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     {getStatusIcon(checklist.completeness)}
                     <span className={`text-sm font-medium ${checklist.completeness === 2 ? 'text-gray-900' : 'text-gray-500'}`}>Data completeness verified</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     {getStatusIcon(checklist.recency)}
                     <span className={`text-sm font-medium ${checklist.recency === 2 ? 'text-gray-900' : 'text-gray-500'}`}>Payment recency check</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     {getStatusIcon(checklist.covenant)}
                     <span className={`text-sm font-medium ${checklist.covenant >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Covenant signal extraction</span>
                  </div>
                  {checklist.covenant === 3 && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Flag Detected</span>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     {getStatusIcon(checklist.valuation)}
                     <span className={`text-sm font-medium ${checklist.valuation === 2 ? 'text-gray-900' : 'text-gray-500'}`}>Valuation coverage</span>
                  </div>
                </div>

              </div>
              
              {ingestedData && checklist.valuation === 2 && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready for Attestation
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section: Loan Data Table */}
          {ingestedData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Portfolio Composition: {ingestedData.portfolio_id}</h3>
                <span className="text-xs text-gray-500 font-mono">AS OF: {ingestedData.as_of}</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3">Loan Reference</th>
                      <th className="px-6 py-3">Days Past Due</th>
                      <th className="px-6 py-3">Valuation Band</th>
                      <th className="px-6 py-3">Covenant Signals</th>
                      <th className="px-6 py-3">Payment History</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ingestedData.loans.map((loan) => (
                      <tr key={loan.loan_id} className={`transition-colors ${getRowStyle(loan)}`}>
                        <td className="px-6 py-4 font-medium text-gray-900 font-mono">{loan.ref}</td>
                        <td className="px-6 py-4">
                          {loan.days_past_due > 0 ? (
                            <span className={`px-2 py-1 rounded-md font-medium ${loan.days_past_due > 90 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>
                              {loan.days_past_due} Days
                            </span>
                          ) : (
                            <span className="text-gray-400">Current</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {loan.valuation_band}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {loan.covenant_flags.length > 0 ? (
                              loan.covenant_flags.map((flag, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                  <AlertTriangle className="w-3 h-3" /> {flag.replace('_', ' ')}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-300 text-xs italic">No Signals</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          {loan.payment_history_summary}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-center text-gray-400">
                End of Preview • All Borrower Identities Redacted Locally
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Workspace;
