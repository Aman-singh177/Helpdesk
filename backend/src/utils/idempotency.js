const idempotencyMap = new Map();
 
const EXPIRY_MS = 5 * 60 * 1000;

export const checkIdempotency = (key) => {
  if (!key) return true;  
 
  if (idempotencyMap.has(key)) return false;
 
  idempotencyMap.set(key, Date.now());
 
  setTimeout(() => {
    idempotencyMap.delete(key);
  }, EXPIRY_MS);

  return true;
};
