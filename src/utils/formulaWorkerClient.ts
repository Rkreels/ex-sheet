// Lightweight singleton client to interact with formulaWorker

let worker: Worker | null = null;

const getWorker = () => {
  if (!worker) {
    worker = new Worker(new URL('../workers/formulaWorker.ts', import.meta.url), { type: 'module' });
  }
  return worker;
};

export const recalcBatch = (
  cells: Record<string, any>,
  cellsToEvaluate: string[]
): Promise<{ cells: Record<string, any> }> => {
  return new Promise((resolve, reject) => {
    const w = getWorker();

    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data || {};
      if (type === 'result') {
        w.removeEventListener('message', handleMessage);
        resolve(payload as { cells: Record<string, any> });
      } else if (type === 'error') {
        w.removeEventListener('message', handleMessage);
        reject(new Error(payload?.message || 'Worker error'));
      }
    };

    w.addEventListener('message', handleMessage);
    w.postMessage({ type: 'batch', payload: { cells, cellsToEvaluate } });
  });
};

export const recalcAll = (
  cells: Record<string, any>
): Promise<{ cells: Record<string, any> }> => {
  return new Promise((resolve, reject) => {
    const w = getWorker();

    const handleMessage = (e: MessageEvent) => {
      const { type, payload } = e.data || {};
      if (type === 'result') {
        w.removeEventListener('message', handleMessage);
        resolve(payload as { cells: Record<string, any> });
      } else if (type === 'error') {
        w.removeEventListener('message', handleMessage);
        reject(new Error(payload?.message || 'Worker error'));
      }
    };

    w.addEventListener('message', handleMessage);
    w.postMessage({ type: 'all', payload: { cells } });
  });
};
