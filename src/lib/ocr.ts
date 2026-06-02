/**
 * OCR abstraction layer.
 * Swap SimulatedOcrProvider with TesseractOcrProvider or cloud vision API in production.
 */

export type OcrResult = {
  text: string;
  confidence: number;
  provider: string;
};

export interface OcrProvider {
  readonly name: string;
  extractText(file: File): Promise<OcrResult>;
}

const SIMULATED_CHAT_SAMPLES = [
  `Customer: Pak pesan 20 sate ayam
Customer: Tambah 5 lontong ya
Customer: Eh sate ayamnya jadi 25
Customer: Saya ambil jam 7 malam`,
  `Customer: Mau sate kambing 15 tusuk
Customer: Plus es teh 2
Customer: Antar ya jam 18.30
Customer: Alamat Jl. Melati 7`,
  `Customer: Pesan 10 sate ayam
Customer: Tambah lontong 3
Customer: Ambil sendiri jam 17.00`,
];

export class SimulatedOcrProvider implements OcrProvider {
  readonly name = "Simulated OCR (dev)";

  async extractText(file: File): Promise<OcrResult> {
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const hash = file.name.length + file.size;
    const text = SIMULATED_CHAT_SAMPLES[hash % SIMULATED_CHAT_SAMPLES.length];

    return {
      text,
      confidence: 87 + (hash % 10),
      provider: this.name,
    };
  }
}

/** Default provider — replace instance when integrating real OCR. */
let activeProvider: OcrProvider = new SimulatedOcrProvider();

export function setOcrProvider(provider: OcrProvider) {
  activeProvider = provider;
}

export function getOcrProvider(): OcrProvider {
  return activeProvider;
}

export async function extractTextFromImage(file: File): Promise<OcrResult> {
  return activeProvider.extractText(file);
}
