import { createMemoryPersistence } from '../js/db.js';

// Reuse store validation and history, but send only changed records to Postgres.
export function createStagedPersistence(snapshot) {
  const memory = createMemoryPersistence(snapshot);
  const changes = [];
  return {
    ...memory,
    changes,
    async commit(change) {
      await memory.commit(change);
      changes.push(structuredClone(change));
    },
  };
}
