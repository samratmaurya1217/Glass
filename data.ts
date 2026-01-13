// Embedded mock data to avoid JSON module resolution issues in browser ESM environments

const healthyPortfolio = {
  "portfolio_id": "healthy-1",
  "as_of": "2026-02-01",
  "total_loans": 20,
  "loans": [
    {"loan_id":"L-0001","ref":"REF-0001","days_past_due":0,"valuation_band":"98-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-01"},
    {"loan_id":"L-0002","ref":"REF-0002","days_past_due":0,"valuation_band":"95-98","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-02"},
    {"loan_id":"L-0003","ref":"REF-0003","days_past_due":0,"valuation_band":"100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-03"},
    {"loan_id":"L-0004","ref":"REF-0004","days_past_due":5,"valuation_band":"92-95","covenant_flags":[],"payment_history_summary":"late fee paid","redacted_borrower_id":"B-xxx-04"},
    {"loan_id":"L-0005","ref":"REF-0005","days_past_due":0,"valuation_band":"98-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-05"},
    {"loan_id":"L-0006","ref":"REF-0006","days_past_due":0,"valuation_band":"98-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-06"},
    {"loan_id":"L-0007","ref":"REF-0007","days_past_due":2,"valuation_band":"95-98","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-07"},
    {"loan_id":"L-0008","ref":"REF-0008","days_past_due":0,"valuation_band":"99-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-08"},
    {"loan_id":"L-0009","ref":"REF-0009","days_past_due":0,"valuation_band":"100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-09"},
    {"loan_id":"L-0010","ref":"REF-0010","days_past_due":12,"valuation_band":"88-92","covenant_flags":[],"payment_history_summary":"minor delay 2025-12","redacted_borrower_id":"B-xxx-10"},
    {"loan_id":"L-0011","ref":"REF-0011","days_past_due":0,"valuation_band":"95-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-11"},
    {"loan_id":"L-0012","ref":"REF-0012","days_past_due":0,"valuation_band":"96-99","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-12"},
    {"loan_id":"L-0013","ref":"REF-0013","days_past_due":0,"valuation_band":"98-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-13"},
    {"loan_id":"L-0014","ref":"REF-0014","days_past_due":0,"valuation_band":"100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-14"},
    {"loan_id":"L-0015","ref":"REF-0015","days_past_due":8,"valuation_band":"90-95","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-15"},
    {"loan_id":"L-0016","ref":"REF-0016","days_past_due":0,"valuation_band":"99-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-16"},
    {"loan_id":"L-0017","ref":"REF-0017","days_past_due":0,"valuation_band":"97-99","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-17"},
    {"loan_id":"L-0018","ref":"REF-0018","days_past_due":0,"valuation_band":"100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-18"},
    {"loan_id":"L-0019","ref":"REF-0019","days_past_due":0,"valuation_band":"95-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-19"},
    {"loan_id":"L-0020","ref":"REF-0020","days_past_due":0,"valuation_band":"98-100","covenant_flags":[],"payment_history_summary":"payments on time","redacted_borrower_id":"B-xxx-20"}
  ]
};

const distressedPortfolio = {
  "portfolio_id": "distressed-1",
  "as_of": "2026-02-01",
  "total_loans": 20,
  "loans": [
    {"loan_id":"L-0101","ref":"REF-0101","days_past_due":120,"valuation_band":"30-40","covenant_flags":["missed_payment", "LTV_breach"],"payment_history_summary":"missed 3 payments","redacted_borrower_id":"B-xxx-21"},
    {"loan_id":"L-0102","ref":"REF-0102","days_past_due":0,"valuation_band":"95-100","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-22"},
    {"loan_id":"L-0103","ref":"REF-0103","days_past_due":45,"valuation_band":"80-85","covenant_flags":["covenant_warning"],"payment_history_summary":"delayed","redacted_borrower_id":"B-xxx-23"},
    {"loan_id":"L-0104","ref":"REF-0104","days_past_due":95,"valuation_band":"50-60","covenant_flags":["technical_default"],"payment_history_summary":"missed 2 payments","redacted_borrower_id":"B-xxx-24"},
    {"loan_id":"L-0105","ref":"REF-0105","days_past_due":0,"valuation_band":"98-100","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-25"},
    {"loan_id":"L-0106","ref":"REF-0106","days_past_due":0,"valuation_band":"90-95","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-26"},
    {"loan_id":"L-0107","ref":"REF-0107","days_past_due":180,"valuation_band":"10-20","covenant_flags":["hard_default", "legal_action"],"payment_history_summary":"no contact","redacted_borrower_id":"B-xxx-27"},
    {"loan_id":"L-0108","ref":"REF-0108","days_past_due":0,"valuation_band":"95-98","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-28"},
    {"loan_id":"L-0109","ref":"REF-0109","days_past_due":0,"valuation_band":"100","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-29"},
    {"loan_id":"L-0110","ref":"REF-0110","days_past_due":30,"valuation_band":"85-90","covenant_flags":[],"payment_history_summary":"1 month late","redacted_borrower_id":"B-xxx-30"},
    {"loan_id":"L-0111","ref":"REF-0111","days_past_due":0,"valuation_band":"95-100","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-31"},
    {"loan_id":"L-0112","ref":"REF-0112","days_past_due":15,"valuation_band":"90-95","covenant_flags":[],"payment_history_summary":"admin delay","redacted_borrower_id":"B-xxx-32"},
    {"loan_id":"L-0113","ref":"REF-0113","days_past_due":0,"valuation_band":"98-100","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-33"},
    {"loan_id":"L-0114","ref":"REF-0114","days_past_due":60,"valuation_band":"70-80","covenant_flags":["watch_list"],"payment_history_summary":"irregular","redacted_borrower_id":"B-xxx-34"},
    {"loan_id":"L-0115","ref":"REF-0115","days_past_due":0,"valuation_band":"99-100","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-35"},
    {"loan_id":"L-0116","ref":"REF-0116","days_past_due":0,"valuation_band":"100","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-36"},
    {"loan_id":"L-0117","ref":"REF-0117","days_past_due":0,"valuation_band":"95-98","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-37"},
    {"loan_id":"L-0118","ref":"REF-0118","days_past_due":92,"valuation_band":"55-65","covenant_flags":["covenant_breach"],"payment_history_summary":"missed 2 payments","redacted_borrower_id":"B-xxx-38"},
    {"loan_id":"L-0119","ref":"REF-0119","days_past_due":0,"valuation_band":"98-100","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-39"},
    {"loan_id":"L-0120","ref":"REF-0120","days_past_due":0,"valuation_band":"96-99","covenant_flags":[],"payment_history_summary":"on time","redacted_borrower_id":"B-xxx-40"}
  ]
};

export interface Loan {
  loan_id: string;
  ref: string;
  days_past_due: number;
  valuation_band: string;
  covenant_flags: string[];
  payment_history_summary: string;
  redacted_borrower_id: string;
}

export interface Dataset {
  portfolio_id: string;
  as_of: string;
  total_loans: number;
  loans: Loan[];
  name?: string; // Enriched property
}

// Registry with friendly keys
export const DATASETS: Record<string, Dataset> = {
  "healthy-1": {
    ...healthyPortfolio,
    name: "Healthy Portfolio (Alpha)"
  },
  "fail-1": {
    ...distressedPortfolio,
    name: "Distressed Debt Fund II (Beta)"
  }
};

export const DATASET_LIST = Object.values(DATASETS);
