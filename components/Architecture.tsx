import React from 'react';
import { 
  Hexagon, 
  LayoutDashboard, 
  ShieldCheck, 
  Server, 
  Activity, 
  FileText,
  Cpu,
  ArrowRight,
  Database,
  Globe,
  Lock,
  Code
} from 'lucide-react';

interface ArchitectureProps {
  onNavigate: (view: string) => void;
}

const Architecture: React.FC<ArchitectureProps> = ({ onNavigate }) => {
  
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
          <SidebarItem icon={Server} label="System Architecture" view="architecture" active />
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
          <h1 className="text-lg font-semibold text-gray-700">System Architecture</h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
             <div className="w-2 h-2 rounded-full bg-blue-500"></div>
             <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Documentation Mode</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 font-serif italic">How GlassVault Works</h2>
            <p className="text-gray-500 text-lg">
              A privacy-preserving architecture that separates sensitive data processing from public verification.
            </p>
          </div>

          {/* Diagram Container */}
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
            
            {/* Background Labels */}
            <div className="absolute top-4 left-4 flex gap-2">
               <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 flex items-center gap-1">
                 <Lock size={10} /> INSTITUTIONAL PERIMETER
               </span>
            </div>
            <div className="absolute top-4 right-4">
               <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200 flex items-center gap-1">
                 <Globe size={10} /> PUBLIC VERIFICATION
               </span>
            </div>

            {/* Dotted Divider */}
            <div className="absolute top-0 bottom-0 right-[25%] border-l-2 border-dashed border-gray-300"></div>

            {/* Flow */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 mt-8">
              
              {/* Box 1 */}
              <div className="flex flex-col items-center text-center space-y-4 w-48 group">
                <div className="w-24 h-24 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 group-hover:border-blue-500 group-hover:text-blue-600 transition-all">
                  <Database size={40} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">1. Data Sources</h3>
                  <p className="text-xs text-gray-500 mt-1">Loan Docs & Servicing Systems</p>
                </div>
              </div>

              <ArrowRight className="text-gray-300 hidden md:block" size={32} />

              {/* Box 2 */}
              <div className="flex flex-col items-center text-center space-y-4 w-48 group">
                <div className="w-24 h-24 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-105 transition-all">
                  <Cpu size={40} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">2. Local Agent</h3>
                  <p className="text-xs text-gray-500 mt-1">Ingests & Standardizes (Production)</p>
                </div>
              </div>

              <ArrowRight className="text-gray-300 hidden md:block" size={32} />

              {/* Box 3 */}
              <div className="flex flex-col items-center text-center space-y-4 w-48 group">
                <div className="w-24 h-24 bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-105 transition-all">
                  <ShieldCheck size={40} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">3. Validation & Proof</h3>
                  <p className="text-xs text-gray-500 mt-1">Zero-Knowledge Attestation</p>
                </div>
              </div>

              {/* Crossing Boundary Arrow */}
              <div className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-400">
                <ArrowRight className="text-gray-300 hidden md:block" size={32} />
                <span>PROOF ONLY</span>
              </div>

              {/* Box 4 */}
              <div className="flex flex-col items-center text-center space-y-4 w-48 group">
                <div className="w-24 h-24 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center justify-center text-green-600 shadow-sm group-hover:scale-105 transition-all">
                  <Globe size={40} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">4. Verification</h3>
                  <p className="text-xs text-gray-500 mt-1">Investors & Auditors Verify Proofs</p>
                </div>
              </div>

            </div>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <ShieldCheck size={20} className="text-blue-500" /> Key Architectural Principles
               </h3>
               <ul className="space-y-3">
                 <li className="flex gap-3 items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                    Runs entirely inside institutional perimeter (on-prem or VPC).
                 </li>
                 <li className="flex gap-3 items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                    Consumes existing system outputs (PDFs, Excel, JSON).
                 </li>
                 <li className="flex gap-3 items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                    No raw borrower data ever leaves the secure environment.
                 </li>
                 <li className="flex gap-3 items-start text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                    Proofs are portable artifacts (JSON) that are independently verifiable.
                 </li>
               </ul>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 text-slate-300 font-mono text-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Code size={100} />
               </div>
               <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Activity size={20} className="text-green-400" /> Developer Reference
               </h3>
               <p className="mb-4 text-slate-400">
                 The dashboard interfaces with the local GlassVault Agent backend endpoints:
               </p>
               <ul className="space-y-2">
                 <li className="flex justify-between border-b border-slate-800 pb-2">
                   <span className="text-blue-400">GET /dataset/:id</span>
                   <span className="text-slate-500">Ingest portfolio state</span>
                 </li>
                 <li className="flex justify-between border-b border-slate-800 pb-2">
                   <span className="text-yellow-400">POST /attest</span>
                   <span className="text-slate-500">Generate ZK proof</span>
                 </li>
                 <li className="flex justify-between border-b border-slate-800 pb-2">
                   <span className="text-green-400">GET /verify/:id</span>
                   <span className="text-slate-500">Public verification</span>
                 </li>
                 <li className="flex justify-between pb-2">
                   <span className="text-purple-400">GET /evidence/:id</span>
                   <span className="text-slate-500">Download artifact</span>
                 </li>
               </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Architecture;