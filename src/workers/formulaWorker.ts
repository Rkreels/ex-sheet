/*
  Web Worker for offloading heavy formula computations to keep UI responsive.
  Supports batch and full-sheet recalculation using the enhanced formula evaluator.
*/

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Workers run in their own context
self.onmessage = async (e: MessageEvent) => {
  try {
    const { type, payload } = e.data || {};

    // Dynamic import to keep worker lightweight on init
    const { batchEvaluateFormulas } = await import('../utils/formulaEvaluator');

    if (type === 'batch') {
      const { cells, cellsToEvaluate } = payload as {
        cells: Record<string, any>;
        cellsToEvaluate: string[];
      };

      const working = { ...cells };
      batchEvaluateFormulas(cellsToEvaluate, working);

      // Post full updated cells back
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      postMessage({ type: 'result', payload: { cells: working } });
      return;
    }

    if (type === 'all') {
      const { cells } = payload as { cells: Record<string, any> };
      const working = { ...cells };

      const formulaCells = Object.keys(working).filter(
        (id) => typeof working[id]?.value === 'string' && String(working[id].value).startsWith('=')
      );

      if (formulaCells.length > 0) {
        batchEvaluateFormulas(formulaCells, working);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      postMessage({ type: 'result', payload: { cells: working } });
      return;
    }

    // Unknown message type
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    postMessage({ type: 'error', payload: { message: 'Unknown worker message type' } });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    postMessage({ type: 'error', payload: { message: (err as Error)?.message || 'Worker error' } });
  }
};
