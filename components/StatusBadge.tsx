import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface StatusBadgeProps {
  label: string;
  status: 'ok' | 'degraded' | 'down';
  infoText?: string;
  tooltip: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ label, status, infoText, tooltip }) => {
  const getStyles = () => {
    switch (status) {
      case 'ok':
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          iconColor: 'text-green-500',
          textColor: 'text-gray-900',
          statusText: 'Operational'
        };
      case 'degraded':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          iconColor: 'text-amber-500',
          textColor: 'text-amber-900',
          statusText: 'Degraded'
        };
      case 'down':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          iconColor: 'text-red-500',
          textColor: 'text-red-900',
          statusText: 'Service Down'
        };
    }
  };

  const styles = getStyles();
  
  return (
    <div className={`${styles.bg} border ${styles.border} rounded-xl p-4 transition-all duration-300 shadow-sm hover:shadow-md group relative`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {status === 'ok' && <CheckCircle className={`w-5 h-5 ${styles.iconColor}`} />}
          {status === 'degraded' && <AlertTriangle className={`w-5 h-5 ${styles.iconColor}`} />}
          {status === 'down' && <XCircle className={`w-5 h-5 ${styles.iconColor}`} />}
          <span className="font-semibold text-gray-700">{label}</span>
        </div>
        <div className="group/tooltip relative">
           <Info className="w-4 h-4 text-gray-400 cursor-help" />
           <div className="absolute right-0 top-6 w-48 bg-gray-900 text-white text-xs p-2 rounded z-20 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none">
             {tooltip}
           </div>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-2">
         <span className={`text-sm font-medium ${styles.textColor}`}>{styles.statusText}</span>
         {infoText && <span className="text-xs font-mono text-gray-500">{infoText}</span>}
      </div>
    </div>
  );
};

export default StatusBadge;