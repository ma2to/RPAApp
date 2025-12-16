/**
 * ✅ RIEŠENIE #3: Conditional logging
 *
 * V produkcii vypne info/debug/log logy, ale ponechá error/warn.
 * Redukuje overhead console.log() volaní v production build.
 */

// Detect production mode
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * Conditional logging helper
 *
 * Usage:
 * const clog = useConditionalLogging()
 * clog.log('info message')     // ❌ Skipped in production
 * clog.info('info message')    // ❌ Skipped in production
 * clog.debug('debug message')  // ❌ Skipped in production
 * clog.warn('warning')         // ✅ Always logged
 * clog.error('error')          // ✅ Always logged
 */
export function useConditionalLogging() {
  // No-op function for production
  const noop = () => {}

  return {
    // ❌ Skipped in production (info/debug overhead)
    log: IS_PRODUCTION ? noop : console.log.bind(console),
    info: IS_PRODUCTION ? noop : console.info.bind(console),
    debug: IS_PRODUCTION ? noop : console.debug.bind(console),

    // ✅ Always logged (critical messages)
    warn: console.warn.bind(console),
    error: console.error.bind(console)
  }
}

/**
 * Safe replacement for console.log in production
 *
 * Usage: Replace direct console.log() calls with clog()
 * const clog = IS_PRODUCTION ? () => {} : console.log.bind(console)
 * clog('[Component]', 'message')  // ❌ Skipped in production
 */
export const clog = IS_PRODUCTION ? () => {} : console.log.bind(console)
export const cinfo = IS_PRODUCTION ? () => {} : console.info.bind(console)
export const cdebug = IS_PRODUCTION ? () => {} : console.debug.bind(console)
export const cwarn = console.warn.bind(console)
export const cerror = console.error.bind(console)
