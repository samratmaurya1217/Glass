import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Server, 
  Activity, 
  Hexagon, 
  Zap,
  Wifi,
  WifiOff,
  AlertTriangle,
  Play,
  RotateCcw,
  Clock,
  CheckCircle2,
  Copy,
  Download,
  X
} from 'lucide-react';
import Button from './Button';
import StatusBadge from './StatusBadge';
import HealthCheckRunner from './HealthCheckRunner';
import { api } from '../store';

interface SystemStatusProps {
  onNavigate: (view: string) => void;
}

interface Incident {
  id: string;
  severity: 'info' | 'warn' | 'critical';
  timestamp: string;
  message: string;
  acknowledged: boolean;
}

interface ProofRecord {
  proofId: string;
  mode: string;
  claim: string;
  timestamp: string;
  status: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ onNavigate }) => {
  // -- State --
  const [isOffline, setIsOffline] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [healthStep, setHealthStep] = useState(0); // 0=idle
  const [simulatedOutage, setSimulatedOutage] = useState(false);
  const [showOutageConfirm, setShowOutageConfirm] = useState(false);
  
  // Data
  const [statusData, setStatusData] = useState<any>(null);
  const [recentProofs, setRecentProofs] = useState<ProofRecord[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // -- Effects --
  useEffect(() => {
    fetchStatus();
    fetchProofs();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await api.getStatus();
      setStatusData(data);
      setIsOffline(data.mode === 'offline');
      setLastChecked(new Date().toISOString());
    } catch (e) {
      // Fallback to offline mock
      setIsOffline(true);
      setLastChecked(new Date().toISOString());
      setStatusData({
        mode: 'offline',
        services: {
          api: { status: 'down', latencyMs: null, lastChecked: null },
          localAgent: { status: 'ok', lastRun: new Date().toISOString() },
          proofLedger: { status: 'down', lag: 5 },
          enclave: { status: 'ok', note: 'Secure enclave active' }
        }
      });
    }
  };

  const fetchProofs = async () => {
    try {
      const data = await api.getProofs(5);
      setRecentProofs(data);
    } catch (e) {
      // Fallback mock proofs
      setRecentProofs([
        { proofId: "GV-OFFLINE-9921", mode: "offline", claim: "No loan > 90 days past due", timestamp: new Date().toISOString(), status: "issued" },
        { proofId: "GV-A7B82-ZK", mode: "online", claim: "No loan > 90 days past due", timestamp: new Date(Date.now() - 86400000).toISOString(), status: "verified" }
      ]);
    }
  };

  const runHealthCheck = async () => {
    setHealthStep(1);
    
    // Animate Steps
    await new Promise(r => setTimeout(r, 600));
    setHealthStep(2);
    await new Promise(r => setTimeout(r, 500));
    setHealthStep(3);
    await new Promise(r => setTimeout(r, 600));
    setHealthStep(4);
    await new Promise(r => setTimeout(r, 500));
    setHealthStep(5); // Done
    
    // Refresh real data
    await fetchStatus();
    
    setTimeout(() => setHealthStep(0), 2000); // Reset UI after delay
  };

  const toggleOutageSimulation = async () => {
    setShowOutageConfirm(false);
    const newState = !simulatedOutage;
    setSimulatedOutage(newState);

    try {
      // Try telling store
      await api.simulateOutage({ service: 'all', state: newState ? 'down' : 'ok' });
      await fetchStatus();
    } catch (e) {
      // Client-side only simulation
      setIsOffline(newState);
      setStatusData((prev: any) => ({
        ...prev,
        mode: newState ? 'offline' : 'online',
        services: {
          ...prev.services,
          api: { ...prev.services.api, status: newState ? 'down' : 'ok' },
          proofLedger: { ...prev.services.proofLedger, status: newState ? 'down' : 'ok' }
        }
      }));
    }

    if (newState) {
      addIncident('warn', 'Simulated outage: API down — switching to offline mode.');
    } else {
      addIncident('info', 'System recovered from simulated outage.');
    }
  };

  const addIncident = (severity: 'info'|'warn'|'critical', message: string) => {
    const newInc: Incident = {
      id: Math.random().toString(36).substr(2, 9),
      severity,
      timestamp: new Date().toISOString(),
      message,
      acknowledged: false
    };
    setIncidents(prev => [newInc, ...prev]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const handleDownloadPack = (proofId: string) => {
     // Mock download
     const blob = new Blob([JSON.stringify({ proofId, evidence: "secure-pack" }, null, 2)], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `evidence-${proofId}.json`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
  };

  // Sidebar reusable (duplication as per instruction to not break other files logic)
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
          <SidebarItem icon={ShieldCheck} label="Verify" view="verify" />
          <SidebarItem icon={Server} label="System Architecture" view="architecture" />
          <SidebarItem icon={Activity} label="System Status" view="status" active />
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
           <div>
             <h1 className="text-lg font-semibold text-gray-700">System Status</h1>
             <p className="text-xs text-gray-500">Operational health & audit trail</p>
           </div>

           {isOffline && (
             <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md animate-pulse">
               <WifiOff className="w-4 h-4 text-amber-600" />
               <span className="text-xs font-bold text-amber-800">OFFLINE MODE — Local Attestation Only</span>
             </div>
           )}
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Controls & Health */}
          <div className="space-y-6">
            
            {/* 1. Health Overview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Activity size={18} /> Service Health
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  {lastChecked ? new Date(lastChecked).toLocaleTimeString() : '--:--'}
                </span>
              </div>

              {statusData ? (
                <>
                  <StatusBadge 
                    label="Backend API"
                    status={statusData.services.api.status}
                    infoText={statusData.services.api.latencyMs ? `${statusData.services.api.latencyMs}ms latency` : 'Connection Failed'}
                    tooltip="GlassVault API: handles attestation storage & verification gateway"
                  />
                  <StatusBadge 
                    label="Local Agent"
                    status={statusData.services.localAgent.status}
                    infoText="Active"
                    tooltip="Local Agent: extracts standardized signals from loan documents"
                  />
                  <StatusBadge 
                    label="Proof Ledger"
                    status={statusData.services.proofLedger.status}
                    infoText={statusData.services.proofLedger.status === 'ok' ? 'Synced' : 'Unreachable'}
                    tooltip="Ledger: stores attestation references and status"
                  />
                  <StatusBadge 
                    label="Secure Enclave"
                    status={statusData.services.enclave.status}
                    infoText="TEE Ready"
                    tooltip="Hardware enclave for zero-knowledge circuit execution"
                  />
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-white border border-gray-200 rounded-xl">
                  Loading status...
                </div>
              )}
            </div>

            {/* 2. Run Health Check */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <Button 
                onClick={runHealthCheck} 
                disabled={healthStep > 0} 
                className="w-full flex justify-center items-center gap-2"
              >
                {healthStep > 0 ? 'Running Diagnostics...' : 'Run Health Check'}
                {healthStep === 0 && <Play size={16} />}
              </Button>
              
              {healthStep > 0 && (
                <HealthCheckRunner isRunning={healthStep > 0 && healthStep < 5} currentStep={healthStep} />
              )}
            </div>

            {/* 3. Simulate Outage */}
            <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between border border-gray-200">
               <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                 <Zap size={16} className={simulatedOutage ? "text-amber-500" : "text-gray-400"} />
                 Simulate Outage (dev)
               </div>
               <button 
                 onClick={() => setShowOutageConfirm(true)}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${simulatedOutage ? 'bg-amber-500' : 'bg-gray-300'}`}
               >
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${simulatedOutage ? 'translate-x-6' : 'translate-x-1'}`} />
               </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Logs & Data */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 4. Recent Proofs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800">Recent Proofs</h3>
                 <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">Latest 5</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="text-gray-500 font-medium border-b border-gray-100">
                     <tr>
                       <th className="px-6 py-3">Proof ID</th>
                       <th className="px-6 py-3">Mode</th>
                       <th className="px-6 py-3">Claim</th>
                       <th className="px-6 py-3">Time</th>
                       <th className="px-6 py-3 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {recentProofs.map((proof) => (
                       <tr key={proof.proofId} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-3 font-mono text-gray-700 relative group">
                            <span className="cursor-pointer border-b border-dotted border-gray-300 hover:border-gray-500" onClick={() => copyToClipboard(proof.proofId)}>
                              {proof.proofId}
                            </span>
                            {copiedId === proof.proofId && (
                               <span className="absolute -top-6 left-0 bg-black text-white text-xs px-2 py-1 rounded animate-fade-in-up">Copied!</span>
                            )}
                         </td>
                         <td className="px-6 py-3">
                           {proof.mode === 'online' ? (
                             <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                               <Wifi size={10} /> Online
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                               <WifiOff size={10} /> Local
                             </span>
                           )}
                         </td>
                         <td className="px-6 py-3 text-gray-600 truncate max-w-[150px]" title={proof.claim}>{proof.claim}</td>
                         <td className="px-6 py-3 text-gray-500 text-xs">{new Date(proof.timestamp).toLocaleTimeString()}</td>
                         <td className="px-6 py-3 text-right">
                            <button onClick={() => handleDownloadPack(proof.proofId)} className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors" title="Download Evidence Pack">
                              <Download size={16} />
                            </button>
                         </td>
                       </tr>
                     ))}
                     {recentProofs.length === 0 && (
                       <tr><td colSpan={5} className="text-center py-6 text-gray-400">No proofs generated in this session.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* 5. Incidents Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <AlertTriangle size={18} className="text-gray-400" /> Operational Incidents
              </h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {incidents.length > 0 ? incidents.map((inc) => (
                  <div key={inc.id} className={`p-4 rounded-lg border flex items-start justify-between gap-4 transition-all ${inc.acknowledged ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex gap-3">
                       <div className={`mt-1 w-2 h-2 rounded-full ${inc.severity === 'critical' ? 'bg-red-500' : inc.severity === 'warn' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                       <div>
                         <p className="text-sm font-medium text-gray-900">{inc.message}</p>
                         <p className="text-xs text-gray-500 mt-1">
                           {inc.severity.toUpperCase()} — {new Date(inc.timestamp).toLocaleTimeString()}
                         </p>
                       </div>
                    </div>
                    {!inc.acknowledged && (
                      <button 
                        onClick={() => setIncidents(prev => prev.map(i => i.id === inc.id ? { ...i, acknowledged: true } : i))}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                    No active incidents. System operating normally.
                  </div>
                )}
              </div>
            </div>

            {/* 6. Integration Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Servicing Feed</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">Synced</p>
                  <p className="text-[10px] text-gray-400 mt-1">{lastChecked ? 'Just now' : 'Pending'}</p>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Local Agent</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">Idle</p>
                  <p className="text-[10px] text-gray-400 mt-1">Ready for ingest</p>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Proof Queue</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">0</p>
                  <p className="text-[10px] text-gray-400 mt-1">Depth</p>
               </div>
               <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Gateway</p>
                  <p className="text-lg font-bold text-green-600 mt-1">{statusData?.services?.api?.latencyMs || '--'}ms</p>
                  <p className="text-[10px] text-gray-400 mt-1">Latency</p>
               </div>
            </div>

          </div>
        </div>

        {/* Confirmation Modal */}
        {showOutageConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 text-amber-600 mb-4">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-gray-900">Confirm Outage Simulation</h3>
              </div>
              <p className="text-gray-600 mb-6">
                This will forcefully disconnect the frontend from the Proof Ledger and API, putting the app into <strong>Offline Mode</strong>. 
                Any proofs generated will be marked as local-only.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowOutageConfirm(false)}>Cancel</Button>
                <Button onClick={toggleOutageSimulation} className="bg-amber-600 hover:bg-amber-700 text-white border-none">
                  Simulate Outage
                </Button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default SystemStatus;