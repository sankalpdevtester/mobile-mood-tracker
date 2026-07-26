/**
 * In-memory cache with TTL for mood data.
 * This module provides a simple caching mechanism to store and retrieve mood data.
 * It uses a Map to store the cached data and a TTL (time to live) to expire the cache.
 */

const cache = new Map();
const TTL = 60 * 60 * 1000; // 1 hour

/**
 * Set a value in the cache.
 * @param {string} key - The key to store the value under.
 * @param {object} value - The value to store.
 */
function setCache(key, value) {
  const now = Date.now();
  cache.set(key, { value, expires: now + TTL });
}

/**
 * Get a value from the cache.
 * @param {string} key - The key to retrieve the value for.
 * @returns {object|undefined} The cached value or undefined if it doesn't exist or has expired.
 */
function getCache(key) {
  const now = Date.now();
  const cached = cache.get(key);
  if (!cached || cached.expires < now) {
    cache.delete(key);
    return undefined;
  }
  return cached.value;
}

/**
 * Clear the cache.
 */
function clearCache() {
  cache.clear();
}

/**
 * Get all cached values.
 * @returns {object[]} An array of cached values.
 */
function getAllCache() {
  const now = Date.now();
  const cachedValues = [];
  cache.forEach((cached, key) => {
    if (cached.expires > now) {
      cachedValues.push({ key, value: cached.value });
    }
  });
  return cachedValues;
}

/**
 * Initialize the cache with existing mood data.
 * @param {object[]} moodData - The existing mood data to cache.
 */
function initCache(moodData) {
  moodData.forEach((mood) => {
    setCache(mood.id, mood);
  });
}

// Example usage:
// const moodData = moodTrackerHelper.getMoodData();
// initCache(moodData);
// const cachedMood = getCache('mood-1');
// console.log(cachedMood);

export { setCache, getCache, clearCache, getAllCache, initCache };