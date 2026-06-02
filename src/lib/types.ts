import type { FulfillmentType, OrderItem, Revision } from "./mock-data";

export type ExtractionStep = {
  id: string;
  label: string;
  status: "pending" | "running" | "done";
  detail?: string;
};

export type FieldConfidence = {
  field: string;
  confidence: number;
  reason: string;
};

export type StructuredRevision = {
  ts: string;
  type: Revision["type"];
  label: string;
  from?: string;
  to?: string;
  text: string;
};

export type AnalysisResult = {
  customer: string;
  phone: string;
  fulfillment: FulfillmentType;
  items: OrderItem[];
  pickupTime?: string;
  deliveryTime?: string;
  deliveryAddress?: string;
  payment: "Transfer" | "Cash" | "QRIS";
  paymentStatus: "Paid" | "Unpaid" | "Pending";
  revisions: Revision[];
  structuredRevisions: StructuredRevision[];
  total: number;
  rawSummary: string;
  confidence: number;
  confidenceReason: string;
  fieldConfidences: FieldConfidence[];
  notes?: string;
  status: "Siap Diproses";
};

export type AnalysisRecord = {
  id: string;
  chat: string;
  analyzedAt: string;
  source: "manual" | "ocr" | "seed";
  result: AnalysisResult;
};

export type ComputedInsight = {
  id: string;
  category: string;
  title: string;
  description: string;
  value?: string;
};
