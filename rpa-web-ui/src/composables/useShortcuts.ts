/**
 * Keyboard Shortcuts Composable
 *
 * Provides keyboard shortcut registration and handling with context support
 */

import { onMounted, onUnmounted } from 'vue'

export enum ShortcutContext {
  Normal = 'normal',
  Editing = 'editing',
  Selection = 'selection',
  Any = 'any'
}

export interface KeyCombination {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

export interface ShortcutDefinition {
  name: string
  key: KeyCombination
  handler: (event: KeyboardEvent) => void | Promise<void>
  context?: ShortcutContext
  enabled?: boolean
  priority?: number
  description?: string
}

export interface ShortcutOptions {
  enabled?: boolean
  context?: ShortcutContext
}

export function useShortcuts(options: ShortcutOptions = {}) {
  const shortcuts = new Map<string, ShortcutDefinition>()
  const currentContext = options.context || ShortcutContext.Normal

  /**
   * Converts KeyCombination to string key for map
   */
  function keyCombinationToString(key: KeyCombination): string {
    const parts: string[] = []
    if (key.ctrl) parts.push('Ctrl')
    if (key.shift) parts.push('Shift')
    if (key.alt) parts.push('Alt')
    if (key.meta) parts.push('Meta')
    parts.push(key.key.toUpperCase())
    return parts.join('+')
  }

  /**
   * Checks if keyboard event matches key combination
   */
  function matchesKeyCombination(event: KeyboardEvent, key: KeyCombination): boolean {
    return (
      event.key.toUpperCase() === key.key.toUpperCase() &&
      !!event.ctrlKey === !!key.ctrl &&
      !!event.shiftKey === !!key.shift &&
      !!event.altKey === !!key.alt &&
      !!event.metaKey === !!key.meta
    )
  }

  /**
   * Checks if shortcut should execute in current context
   */
  function isContextMatch(shortcutContext: ShortcutContext, current: ShortcutContext): boolean {
    return shortcutContext === ShortcutContext.Any ||
           shortcutContext === current ||
           current === ShortcutContext.Any
  }

  /**
   * Handles keyboard events
   */
  async function handleKeyDown(event: KeyboardEvent): Promise<void> {
    if (!options.enabled && options.enabled !== undefined) {
      return
    }

    // Find matching shortcuts
    const matchingShortcuts = Array.from(shortcuts.values()).filter(shortcut => {
      return (
        shortcut.enabled !== false &&
        matchesKeyCombination(event, shortcut.key) &&
        isContextMatch(shortcut.context || ShortcutContext.Normal, currentContext)
      )
    })

    if (matchingShortcuts.length === 0) {
      return
    }

    // Sort by priority (higher priority first)
    matchingShortcuts.sort((a, b) => (b.priority || 0) - (a.priority || 0))

    // Execute highest priority shortcut
    const shortcut = matchingShortcuts[0]
    event.preventDefault()
    event.stopPropagation()

    try {
      await shortcut.handler(event)
    } catch (error) {
      console.error(`Shortcut execution failed for ${shortcut.name}:`, error)
    }
  }

  /**
   * Registers a keyboard shortcut
   */
  function registerShortcut(definition: ShortcutDefinition): void {
    const keyString = keyCombinationToString(definition.key)

    if (shortcuts.has(keyString)) {
      console.warn(`Shortcut ${keyString} is already registered. Overwriting.`)
    }

    shortcuts.set(keyString, {
      ...definition,
      enabled: definition.enabled !== false,
      context: definition.context || ShortcutContext.Normal,
      priority: definition.priority || 0
    })
  }

  /**
   * Registers multiple shortcuts
   */
  function registerShortcuts(definitions: ShortcutDefinition[]): void {
    definitions.forEach(registerShortcut)
  }

  /**
   * Unregisters a shortcut by key combination
   */
  function unregisterShortcut(key: KeyCombination): boolean {
    const keyString = keyCombinationToString(key)
    return shortcuts.delete(keyString)
  }

  /**
   * Unregisters a shortcut by name
   */
  function unregisterShortcutByName(name: string): boolean {
    const entry = Array.from(shortcuts.entries()).find(([_, def]) => def.name === name)
    if (entry) {
      shortcuts.delete(entry[0])
      return true
    }
    return false
  }

  /**
   * Enables or disables a shortcut
   */
  function setShortcutEnabled(name: string, enabled: boolean): void {
    const entry = Array.from(shortcuts.entries()).find(([_, def]) => def.name === name)
    if (entry) {
      entry[1].enabled = enabled
    }
  }

  /**
   * Gets all registered shortcuts
   */
  function getShortcuts(): ShortcutDefinition[] {
    return Array.from(shortcuts.values())
  }

  /**
   * Gets shortcuts for specific context
   */
  function getShortcutsByContext(context: ShortcutContext): ShortcutDefinition[] {
    return Array.from(shortcuts.values()).filter(
      s => s.context === context || s.context === ShortcutContext.Any
    )
  }

  /**
   * Clears all shortcuts
   */
  function clearShortcuts(): void {
    shortcuts.clear()
  }

  // Setup keyboard event listener
  onMounted(() => {
    if (options.enabled !== false) {
      document.addEventListener('keydown', handleKeyDown as unknown as EventListener)
    }
  })

  // Cleanup
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown as unknown as EventListener)
  })

  return {
    registerShortcut,
    registerShortcuts,
    unregisterShortcut,
    unregisterShortcutByName,
    setShortcutEnabled,
    getShortcuts,
    getShortcutsByContext,
    clearShortcuts,
    handleKeyDown
  }
}

/**
 * Helper functions to create common key combinations
 */
export const Keys = {
  ctrl: (key: string): KeyCombination => ({ key, ctrl: true }),
  shift: (key: string): KeyCombination => ({ key, shift: true }),
  alt: (key: string): KeyCombination => ({ key, alt: true }),
  ctrlShift: (key: string): KeyCombination => ({ key, ctrl: true, shift: true }),
  ctrlAlt: (key: string): KeyCombination => ({ key, ctrl: true, alt: true }),
  single: (key: string): KeyCombination => ({ key })
}

/**
 * Pre-defined shortcut definitions for common operations
 */
export function createDefaultShortcuts(handlers: {
  onCopy?: () => void | Promise<void>
  onPaste?: () => void | Promise<void>
  onCut?: () => void | Promise<void>
  onDelete?: () => void | Promise<void>
  onSelectAll?: () => void | Promise<void>
  onFind?: () => void | Promise<void>
  onUndo?: () => void | Promise<void>
  onRedo?: () => void | Promise<void>
  onEscape?: () => void | Promise<void>
  onEnter?: () => void | Promise<void>
  onTab?: () => void | Promise<void>
  onArrowUp?: () => void | Promise<void>
  onArrowDown?: () => void | Promise<void>
  onArrowLeft?: () => void | Promise<void>
  onArrowRight?: () => void | Promise<void>
}): ShortcutDefinition[] {
  const shortcuts: ShortcutDefinition[] = []

  if (handlers.onCopy) {
    shortcuts.push({
      name: 'Copy',
      key: Keys.ctrl('c'),
      handler: handlers.onCopy,
      description: 'Copy selected cells',
      priority: 100
    })
  }

  if (handlers.onPaste) {
    shortcuts.push({
      name: 'Paste',
      key: Keys.ctrl('v'),
      handler: handlers.onPaste,
      description: 'Paste from clipboard',
      priority: 100
    })
  }

  if (handlers.onCut) {
    shortcuts.push({
      name: 'Cut',
      key: Keys.ctrl('x'),
      handler: handlers.onCut,
      description: 'Cut selected cells',
      priority: 100
    })
  }

  if (handlers.onDelete) {
    shortcuts.push({
      name: 'Delete',
      key: Keys.single('Delete'),
      handler: handlers.onDelete,
      description: 'Delete selected cells',
      priority: 100
    })
  }

  if (handlers.onSelectAll) {
    shortcuts.push({
      name: 'SelectAll',
      key: Keys.ctrl('a'),
      handler: handlers.onSelectAll,
      description: 'Select all cells',
      priority: 100
    })
  }

  if (handlers.onFind) {
    shortcuts.push({
      name: 'Find',
      key: Keys.ctrl('f'),
      handler: handlers.onFind,
      description: 'Open find dialog',
      priority: 100
    })
  }

  if (handlers.onUndo) {
    shortcuts.push({
      name: 'Undo',
      key: Keys.ctrl('z'),
      handler: handlers.onUndo,
      description: 'Undo last action',
      priority: 100
    })
  }

  if (handlers.onRedo) {
    shortcuts.push({
      name: 'Redo',
      key: Keys.ctrlShift('z'),
      handler: handlers.onRedo,
      description: 'Redo last undone action',
      priority: 100
    })
  }

  if (handlers.onEscape) {
    shortcuts.push({
      name: 'Escape',
      key: Keys.single('Escape'),
      handler: handlers.onEscape,
      description: 'Cancel current operation',
      priority: 100
    })
  }

  if (handlers.onEnter) {
    shortcuts.push({
      name: 'Enter',
      key: Keys.single('Enter'),
      handler: handlers.onEnter,
      description: 'Confirm edit and move to next row',
      context: ShortcutContext.Editing,
      priority: 100
    })
  }

  if (handlers.onTab) {
    shortcuts.push({
      name: 'Tab',
      key: Keys.single('Tab'),
      handler: handlers.onTab,
      description: 'Move to next cell',
      priority: 100
    })
  }

  if (handlers.onArrowUp) {
    shortcuts.push({
      name: 'ArrowUp',
      key: Keys.single('ArrowUp'),
      handler: handlers.onArrowUp,
      description: 'Move selection up',
      priority: 50
    })
  }

  if (handlers.onArrowDown) {
    shortcuts.push({
      name: 'ArrowDown',
      key: Keys.single('ArrowDown'),
      handler: handlers.onArrowDown,
      description: 'Move selection down',
      priority: 50
    })
  }

  if (handlers.onArrowLeft) {
    shortcuts.push({
      name: 'ArrowLeft',
      key: Keys.single('ArrowLeft'),
      handler: handlers.onArrowLeft,
      description: 'Move selection left',
      priority: 50
    })
  }

  if (handlers.onArrowRight) {
    shortcuts.push({
      name: 'ArrowRight',
      key: Keys.single('ArrowRight'),
      handler: handlers.onArrowRight,
      description: 'Move selection right',
      priority: 50
    })
  }

  return shortcuts
}
