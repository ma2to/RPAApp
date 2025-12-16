/**
 * Theme Utility Functions
 * Helpers for importing, exporting, and validating themes
 */

import type { DataGridTheme, ListBoxTheme } from '@/types/theme'

/**
 * Export DataGrid theme to JSON string
 */
export function exportDataGridTheme(theme: DataGridTheme, pretty = true): string {
  return JSON.stringify(theme, null, pretty ? 2 : 0)
}

/**
 * Export ListBox theme to JSON string
 */
export function exportListBoxTheme(theme: ListBoxTheme, pretty = true): string {
  return JSON.stringify(theme, null, pretty ? 2 : 0)
}

/**
 * Import DataGrid theme from JSON string
 */
export function importDataGridTheme(json: string): DataGridTheme | null {
  try {
    const theme = JSON.parse(json) as DataGridTheme
    if (validateDataGridTheme(theme)) {
      return theme
    }
    return null
  } catch (error) {
    console.error('Failed to import DataGrid theme:', error)
    return null
  }
}

/**
 * Import ListBox theme from JSON string
 */
export function importListBoxTheme(json: string): ListBoxTheme | null {
  try {
    const theme = JSON.parse(json) as ListBoxTheme
    if (validateListBoxTheme(theme)) {
      return theme
    }
    return null
  } catch (error) {
    console.error('Failed to import ListBox theme:', error)
    return null
  }
}

/**
 * Validate DataGrid theme structure
 */
export function validateDataGridTheme(theme: any): theme is DataGridTheme {
  if (!theme || typeof theme !== 'object') return false

  const requiredGroups = [
    'cellColors',
    'rowColors',
    'headerColors',
    'validationColors',
    'selectionColors',
    'borderColors',
    'specialColumnColors',
    'uiControlColors'
  ]

  return requiredGroups.every(group => group in theme && typeof theme[group] === 'object')
}

/**
 * Validate ListBox theme structure
 */
export function validateListBoxTheme(theme: any): theme is ListBoxTheme {
  if (!theme || typeof theme !== 'object') return false

  const requiredGroups = ['itemColors', 'containerColors', 'checkboxColors', 'scrollbarColors']

  return requiredGroups.every(group => group in theme && typeof theme[group] === 'object')
}

/**
 * Download theme as JSON file
 */
export function downloadThemeAsFile(
  theme: DataGridTheme | ListBoxTheme,
  filename: string,
  type: 'dataGrid' | 'listBox'
) {
  const json = type === 'dataGrid'
    ? exportDataGridTheme(theme as DataGridTheme)
    : exportListBoxTheme(theme as ListBoxTheme)

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Load theme from file
 */
export function loadThemeFromFile(
  file: File,
  type: 'dataGrid' | 'listBox'
): Promise<DataGridTheme | ListBoxTheme | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string
      if (!content) {
        resolve(null)
        return
      }

      const theme = type === 'dataGrid'
        ? importDataGridTheme(content)
        : importListBoxTheme(content)

      resolve(theme)
    }

    reader.onerror = () => {
      console.error('Failed to read file')
      resolve(null)
    }

    reader.readAsText(file)
  })
}

/**
 * Merge partial theme with base theme
 */
export function mergeTheme<T extends Record<string, any>>(
  baseTheme: T,
  partialTheme: Partial<T>
): T {
  const result = { ...baseTheme }

  for (const key in partialTheme) {
    if (partialTheme[key] !== undefined) {
      if (
        typeof partialTheme[key] === 'object' &&
        !Array.isArray(partialTheme[key]) &&
        partialTheme[key] !== null
      ) {
        // Deep merge for nested objects
        result[key] = {
          ...(baseTheme[key] || {}),
          ...partialTheme[key]
        } as T[Extract<keyof T, string>]
      } else {
        result[key] = partialTheme[key] as T[Extract<keyof T, string>]
      }
    }
  }

  return result
}

/**
 * Get theme color palette (extract all unique colors)
 */
export function getThemePalette(theme: DataGridTheme | ListBoxTheme): string[] {
  const colors = new Set<string>()

  function extractColors(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && isValidColor(obj[key])) {
        colors.add(obj[key])
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractColors(obj[key])
      }
    }
  }

  extractColors(theme)
  return Array.from(colors).sort()
}

/**
 * Validate if string is a valid CSS color
 */
export function isValidColor(color: string): boolean {
  // Check for common CSS color formats
  const hexPattern = /^#[0-9A-Fa-f]{3,8}$/
  const rgbPattern = /^rgba?\([^)]+\)$/
  const hslPattern = /^hsla?\([^)]+\)$/

  return (
    hexPattern.test(color) ||
    rgbPattern.test(color) ||
    hslPattern.test(color) ||
    CSS.supports('color', color)
  )
}

/**
 * Convert hex color to RGBA
 */
export function hexToRgba(hex: string, alpha = 1): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Lighten a color by percentage
 */
export function lightenColor(color: string, percent: number): string {
  // Simple implementation for hex colors
  if (!color.startsWith('#')) return color

  const num = parseInt(color.slice(1), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, ((num >> 16) & 0xff) + amt)
  const G = Math.min(255, ((num >> 8) & 0xff) + amt)
  const B = Math.min(255, (num & 0xff) + amt)

  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/**
 * Darken a color by percentage
 */
export function darkenColor(color: string, percent: number): string {
  // Simple implementation for hex colors
  if (!color.startsWith('#')) return color

  const num = parseInt(color.slice(1), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, ((num >> 16) & 0xff) - amt)
  const G = Math.max(0, ((num >> 8) & 0xff) - amt)
  const B = Math.max(0, (num & 0xff) - amt)

  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/**
 * Generate theme from base color
 */
export function generateThemeFromBaseColor(baseColor: string): Partial<DataGridTheme> {
  return {
    cellColors: {
      defaultBackground: '#ffffff',
      defaultForeground: darkenColor(baseColor, 80),
      hoverBackground: lightenColor(baseColor, 45),
      hoverForeground: darkenColor(baseColor, 80),
      focusedBackground: lightenColor(baseColor, 30),
      focusedForeground: darkenColor(baseColor, 60),
      disabledBackground: lightenColor(baseColor, 50),
      disabledForeground: lightenColor(baseColor, 20),
      readOnlyBackground: lightenColor(baseColor, 48),
      readOnlyForeground: darkenColor(baseColor, 40)
    },
    headerColors: {
      background: darkenColor(baseColor, 40),
      foreground: '#ffffff',
      hoverBackground: darkenColor(baseColor, 30),
      pressedBackground: darkenColor(baseColor, 50),
      sortIndicatorColor: lightenColor(baseColor, 20)
    },
    selectionColors: {
      selectionBorder: baseColor,
      selectionFill: hexToRgba(baseColor, 0.1),
      multiSelectionBackground: lightenColor(baseColor, 30),
      multiSelectionForeground: darkenColor(baseColor, 60)
    }
  }
}
