import type { AnalysisRecord } from "./types";
import { analyzeChat } from "./order-analyzer";
import { generateDemoRecords } from "./demo-dataset";

const HISTORY_KEY = "orderiq:history";
const SEEDED_KEY = "orderiq:seeded";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getAnalysisHistory(): AnalysisRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnalysisRecord[];
  } catch {
    return [];
  }
}

function saveHistory(records: AnalysisRecord[]) {
  if (!isBrowser()) return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

export function saveAnalysis(
  chat: string,
  source: AnalysisRecord["source"] = "manual",
  existingResult?: AnalysisRecord["result"],
): AnalysisRecord {
  const record: AnalysisRecord = {
    id: `AN-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    chat,
    analyzedAt: new Date().toISOString(),
    source,
    result: existingResult ?? analyzeChat(chat),
  };

  const history = getAnalysisHistory();
  history.unshift(record);
  saveHistory(history.slice(0, 500));
  return record;
}

export function deleteAnalysis(id: string) {
  saveHistory(getAnalysisHistory().filter((r) => r.id !== id));
}

export function clearHistory() {
  if (!isBrowser()) return;
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(SEEDED_KEY);
}

export function seedDemoDataset(force = false): number {
  if (!isBrowser()) return 0;
  if (!force && localStorage.getItem(SEEDED_KEY)) {
    return getAnalysisHistory().length;
  }

  const records = generateDemoRecords(100);
  saveHistory(records);
  localStorage.setItem(SEEDED_KEY, "1");
  return records.length;
}

export function initOrderStorage() {
  if (!isBrowser()) return;
  seedDemoDataset();
}

export function getHistoryStats() {
  const history = getAnalysisHistory();
  const pickup = history.filter((r) => r.result.fulfillment === "pickup").length;
  const withRevisions = history.filter((r) => r.result.revisions.length > 0).length;
  const totalItems = history.reduce((s, r) => s + r.result.items.length, 0);

  return {
    total: history.length,
    pickupPct: history.length ? Math.round((pickup / history.length) * 100) : 0,
    revisionPct: history.length ? Math.round((withRevisions / history.length) * 100) : 0,
    avgItems: history.length ? +(totalItems / history.length).toFixed(1) : 0,
  };
}
