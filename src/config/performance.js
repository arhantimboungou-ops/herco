// Performance Configuration
export const PERFORMANCE_CONFIG = {
  // Cache settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  CACHE_MAX_SIZE: 100,

  // List rendering
  INITIAL_NUM_TO_RENDER: 10,
  MAX_TO_RENDER_PER_BATCH: 10,
  UPDATE_DELAY: 50,

  // Animation settings
  ANIMATION_DURATION: 300,
  ANIMATION_DELAY: 50,

  // API settings
  API_TIMEOUT: 10000,
  API_RETRY_COUNT: 3,
  API_RETRY_DELAY: 1000,

  // Memory management
  ENABLE_MEMORY_OPTIMIZATION: true,
  GARBAGE_COLLECTION_INTERVAL: 60000, // 1 minute

  // Logging
  ENABLE_PERFORMANCE_LOGGING: __DEV__,
  LOG_SLOW_RENDERS: __DEV__,
  SLOW_RENDER_THRESHOLD: 16, // ms (60 FPS)
};

// Memoization helpers
export const createMemoizedSelector = (selector) => {
  let lastArgs;
  let lastResult;

  return (...args) => {
    if (lastArgs === undefined || !argsAreEqual(args, lastArgs)) {
      lastArgs = args;
      lastResult = selector(...args);
    }
    return lastResult;
  };
};

const argsAreEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

// Performance monitoring
export const measurePerformance = (label, fn) => {
  if (!PERFORMANCE_CONFIG.ENABLE_PERFORMANCE_LOGGING) {
    return fn();
  }

  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  if (duration > 50) {
    console.warn(`⚠️ Performance: ${label} took ${duration.toFixed(2)}ms`);
  }

  return result;
};
