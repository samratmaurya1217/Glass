import { DATASET_LIST, DATASETS, Dataset } from './data';

// -- Types --

export interface ProofRecord {
  proofId: string;
  portfolio_id: string;
  claim: string;
  dataHash: string;
  validationSummary: Record<string, any>;
  generatedBy: string;
  generatedAt: string;
}

interface ServiceHealth {
  mode: string;
  services: {
    api: { status: string; latencyMs: number | null; lastChecked: string | null };
    localAgent: { status: string; lastRun: string };
    proofLedger: { status: string; lag: number };
    enclave: { status: string; note: string };
  };
}

// -- State (Singleton) --

let proofStore = new Map<string, ProofRecord>();

let serviceHealth: ServiceHealth = {
  mode: 'online',
  services: {
    api: { status: 'ok', latencyMs: 42, lastChecked: new Date().toISOString() },
    localAgent: { status: 'ok', lastRun: new Date().toISOString() },
    proofLedger: { status: 'ok', lag: 0 },
    enclave: { status: 'ok', note: 'Secure enclave active' }
  }
};

// -- Helpers --

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const randomId = (prefix: string) => {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${result}`;
};

// -- API --

export const api = {
  
  // 1. GET /datasets
  async getDatasets() {
    await delay(300);
    if (serviceHealth.mode === 'offline') throw new Error('Network Error');
    
    return DATASET_LIST.map(d => ({
      id: d.portfolio_id,
      name: d.name,
      asOf: d.as_of,
      loans: d.loans.length
    }));
  },

  // 2. GET /dataset/:id
  async getDataset(id: string) {
    await delay(400);
    // Allow local access even if offline? 
    // The prompt says "Offline Validation Mode must ALWAYS use the local JSON imports."
    // But typically an API call fails offline. 
    // We will simulate failure if offline to trigger the component's fallback logic, 
    // OR we can make this method "local safe".
    // Existing components catch error and set offline mode. 
    // Let's fail if offline to preserve that flow, unless explicitly local.
    
    if (serviceHealth.mode === 'offline') throw new Error('Network Error');

    // Find by ID match (fuzzy match to handle the portfolio_id vs key difference if any)
    const dataset = DATASET_LIST.find(d => d.portfolio_id === id);
    if (!dataset) throw new Error('Not found');
    
    return dataset;
  },

  // Direct access for Offline Mode fallback
  getDatasetLocal(id: string) {
    return DATASET_LIST.find(d => d.portfolio_id === id || d.portfolio_id.includes(id.split('-')[0]));
  },

  // 3. POST /attest
  async attest(payload: any) {
    await delay(800);
    
    if (serviceHealth.mode === 'offline' || serviceHealth.services.proofLedger.status === 'down') {
      throw new Error('Service Unavailable');
    }

    const { portfolio_id, claim, dataHash, validationSummary, generatedBy } = payload;
    
    const proofId = randomId('GV');
    const generatedAt = new Date().toISOString();

    const record: ProofRecord = {
      proofId,
      portfolio_id,
      claim,
      dataHash: dataHash || 'mock-hash',
      validationSummary: validationSummary || {},
      generatedBy: generatedBy || 'system',
      generatedAt
    };

    proofStore.set(proofId, record);
    return { proofId, status: 'issued', generatedAt };
  },

  // 4. GET /verify/:proofId
  async verify(proofId: string) {
    await delay(600);
    // Even verify works via API normally
    if (serviceHealth.mode === 'offline') throw new Error('Network Error');

    const record = proofStore.get(proofId);
    if (!record) return { status: 'not_found', proofId };

    return {
      proofId,
      status: 'verified',
      claim: record.claim,
      claimMatch: true,
      portfolio_id: record.portfolio_id,
      generatedAt: record.generatedAt,
      validationSummary: record.validationSummary
    };
  },

  // 5. GET /evidence/:proofId
  async getEvidence(proofId: string) {
    await delay(500);
    if (serviceHealth.mode === 'offline') throw new Error('Network Error');

    const record = proofStore.get(proofId);
    if (!record) throw new Error('Not found');

    const dataset = DATASET_LIST.find(d => d.portfolio_id === record.portfolio_id);
    const sampleRows = dataset ? dataset.loans.slice(0, 3).map(l => ({
      loan_ref: l.ref,
      days_past_due: l.days_past_due,
      valuation_band: l.valuation_band
    })) : [];

    return {
      proofId: record.proofId,
      portfolio_id: record.portfolio_id,
      claim: record.claim,
      generatedAt: record.generatedAt,
      dataHash: record.dataHash,
      validationSummary: record.validationSummary,
      sampleRows
    };
  },

  // 6. GET /status
  async getStatus() {
    await delay(200);
    // Status endpoint might work even if "offline" logic is active in simulated way, 
    // but usually returns the status.
    // Update timestamps
    serviceHealth.services.api.lastChecked = new Date().toISOString();
    if (serviceHealth.services.api.status === 'ok') {
       serviceHealth.services.api.latencyMs = 35 + Math.floor(Math.random() * 20);
    }
    return { ...serviceHealth, checkedAt: new Date().toISOString() };
  },

  // 7. POST /simulate/outage
  async simulateOutage(payload: { service: string, state: string }) {
    await delay(100);
    const { service, state } = payload;
    
    if (service === 'all') {
      const isDown = state === 'down';
      serviceHealth.mode = isDown ? 'offline' : 'online';
      serviceHealth.services.api.status = isDown ? 'down' : 'ok';
      serviceHealth.services.proofLedger.status = isDown ? 'down' : 'ok';
      serviceHealth.services.localAgent.status = isDown ? 'degraded' : 'ok';
    } else {
      // @ts-ignore
      if (serviceHealth.services[service]) serviceHealth.services[service].status = state;
    }
    
    return serviceHealth;
  },

  // 8. GET /proofs
  async getProofs(limit = 5) {
    await delay(300);
    if (serviceHealth.mode === 'offline') throw new Error('Network Error');

    return Array.from(proofStore.values())
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, limit)
      .map(p => ({
        proofId: p.proofId,
        mode: 'online',
        claim: p.claim,
        timestamp: p.generatedAt,
        status: 'issued'
      }));
  }
};
