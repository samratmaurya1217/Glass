import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, Circle, Server, Database, Shield, Cpu } from 'lucide-react';

interface HealthCheckRunnerProps {
  isRunning: boolean;
  currentStep: number; // 0=idle, 1=api, 2=agent, 3=ledger, 4=enclave, 5=done
}

const HealthCheckRunner: React.FC<HealthCheckRunnerProps> = ({ isRunning, currentStep }) => {
  const steps = [
    { id: 1, label: 'Backend API', icon: Server },
    { id: 2, label: 'Local Agent', icon: Cpu },
    { id: 3, label: 'Proof Ledger', icon: Database },
    { id: 4, label: 'Secure Enclave', icon: Shield },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Diagnostics Sequence</h3>
      
      <div className="space-y-3">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg transition-colors duration-300 ${
                   isActive ? 'bg-blue-100 text-blue-600' : isDone ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                 }`}>
                   <Icon size={16} />
                 </div>
                 <span className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-blue-700' : isDone ? 'text-gray-900' : 'text-gray-400'
                 }`}>
                   {step.label}
                 </span>
              </div>
              
              <div>
                {isActive && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                {isDone && <CheckCircle className="w-4 h-4 text-green-500 animate-in zoom-in duration-300" />}
                {!isActive && !isDone && <Circle className="w-4 h-4 text-gray-200" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(((currentStep - 1) / 4) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default HealthCheckRunner;