export const ocrService = {
  async extractText(file: File) {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng");

    try {
      const {
        data: { text },
      } = await worker.recognize(file);

      return text.trim();
    } finally {
      await worker.terminate();
    }
  },
};
