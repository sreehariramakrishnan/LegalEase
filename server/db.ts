// Dummy DB so the project can run without a real database

export const db = {
  // Fake select
  select: () => ({
    from: () => Promise.resolve([]),
  }),

  // Fake insert
  insert: () => ({
    values: () => Promise.resolve({}),
  }),

  // Fake delete
  delete: () => ({
    where: () => Promise.resolve({}),
  }),
};

// No pool required
export const pool = null;
