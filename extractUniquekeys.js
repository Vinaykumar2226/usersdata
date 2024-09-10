// utils/uniqueKeysExtractor.js

/**
 * Extracts all unique keys from an array of objects.
 * Adds a '*' suffix to keys where the value is an object (not an array).
 * 
 * @param {Object[]} data - Array of objects to extract keys from.
 * @returns {string[]} Array of unique key names.
 */
function extractUniqueKeys(data) {
  const uniqueKeys = new Set();

  function traverseObject(obj, parentKey = '') {
    for (const key of Object.keys(obj)) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (Array.isArray(obj[key])) {
        // If the value is an array, do not modify the key.
        uniqueKeys.add(fullKey);
      } else if (obj[key] && typeof obj[key] === 'object') {
        // If the value is an object, append '*' and traverse deeper.
        uniqueKeys.add(fullKey + '*');
        traverseObject(obj[key], fullKey);
      } else {
        // If the value is not an object or array, just add the key.
        uniqueKeys.add(fullKey);
      }
    }
  }

  data.forEach(item => traverseObject(item));

  return Array.from(uniqueKeys);
}

module.exports = extractUniqueKeys;
