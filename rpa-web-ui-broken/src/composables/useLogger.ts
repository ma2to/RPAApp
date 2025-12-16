/**
 * Asynchronous Logger with Queue
 *
 * FEATURES:
 * - Non-blocking: logs are queued and written asynchronously
 * - FIFO queue: oldest logs are written first
 * - Batch processing: multiple logs written in one operation
 * - Error tracking: captures unhandled errors automatically
 */

import { ref } from 'vue'

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  category: string
  message: string
  data?: any
}

// Global log queue (FIFO - First In, First Out)
const logQueue = ref<LogEntry[]>([])
const isProcessing = ref(false)
const BATCH_SIZE = 50 // Process 50 logs at once
const PROCESSING_INTERVAL = 100 // Process every 100ms

let processingTimer: number | null = null

/**
 * Formats timestamp to ISO string with milliseconds
 */
function getTimestamp(): string {
  const now = new Date()
  return now.toISOString()
}

/**
 * Adds log entry to queue (non-blocking)
 */
function enqueueLog(level: LogLevel, category: string, message: string, data?: any) {
  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level,
    category,
    message,
    data: data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined
  }

  logQueue.value.push(entry)

  // Start processing if not already running
  if (!isProcessing.value) {
    startProcessing()
  }
}

/**
 * Starts asynchronous log processing
 */
function startProcessing() {
  if (processingTimer !== null) return

  isProcessing.value = true

  processingTimer = window.setInterval(() => {
    processLogBatch()
  }, PROCESSING_INTERVAL)
}

/**
 * Stops log processing (when queue is empty)
 */
function stopProcessing() {
  if (processingTimer !== null) {
    window.clearInterval(processingTimer)
    processingTimer = null
  }
  isProcessing.value = false
}

/**
 * Processes a batch of logs from the queue
 * Uses FIFO - oldest logs are processed first
 */
function processLogBatch() {
  if (logQueue.value.length === 0) {
    stopProcessing()
    return
  }

  // Take oldest logs (FIFO)
  const batch = logQueue.value.splice(0, BATCH_SIZE)

  // Write batch to console
  for (const entry of batch) {
    writeLogToConsole(entry)
  }
}

/**
 * Writes a single log entry to console
 */
function writeLogToConsole(entry: LogEntry) {
  const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.category}]`
  const message = `${prefix} ${entry.message}`

  switch (entry.level) {
    case 'DEBUG':
      if (entry.data !== undefined) {
        console.debug(message, entry.data)
      } else {
        console.debug(message)
      }
      break
    case 'INFO':
      if (entry.data !== undefined) {
        console.log(message, entry.data)
      } else {
        console.log(message)
      }
      break
    case 'WARN':
      if (entry.data !== undefined) {
        console.warn(message, entry.data)
      } else {
        console.warn(message)
      }
      break
    case 'ERROR':
    case 'FATAL':
      if (entry.data !== undefined) {
        console.error(message, entry.data)
      } else {
        console.error(message)
      }
      break
  }
}

/**
 * Public Logger Interface
 */
export function useLogger(category: string = 'App') {
  return {
    debug(message: string, data?: any) {
      enqueueLog('DEBUG', category, message, data)
    },

    info(message: string, data?: any) {
      enqueueLog('INFO', category, message, data)
    },

    warn(message: string, data?: any) {
      enqueueLog('WARN', category, message, data)
    },

    error(message: string, data?: any) {
      enqueueLog('ERROR', category, message, data)
    },

    fatal(message: string, data?: any) {
      enqueueLog('FATAL', category, message, data)
    },

    /**
     * Flushes all pending logs immediately (synchronously)
     */
    flush() {
      while (logQueue.value.length > 0) {
        const entry = logQueue.value.shift()!
        writeLogToConsole(entry)
      }
      stopProcessing()
    },

    /**
     * Gets current queue size
     */
    getQueueSize(): number {
      return logQueue.value.length
    }
  }
}

/**
 * Global Error Handlers
 * Captures unhandled errors and promise rejections
 */
export function setupGlobalErrorHandlers() {
  const logger = useLogger('GlobalError')

  // Capture unhandled JavaScript errors
  window.addEventListener('error', (event: ErrorEvent) => {
    logger.error('Unhandled Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack || event.error?.toString() || 'No stack trace'
    })
  })

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    logger.error('Unhandled Promise Rejection', {
      reason: event.reason?.toString() || 'Unknown reason',
      stack: event.reason?.stack || 'No stack trace'
    })
  })

  logger.info('Global error handlers initialized')
}

/**
 * Vue Error Handler
 * Install this in main.ts: app.config.errorHandler = vueErrorHandler
 */
export function vueErrorHandler(err: any, instance: any, info: string) {
  const logger = useLogger('VueError')

  logger.error('Vue Error', {
    error: err?.toString() || 'Unknown error',
    stack: err?.stack || 'No stack trace',
    component: instance?.$options?.name || instance?.$options?.__name || 'Unknown component',
    info
  })
}
