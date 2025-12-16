// composables/useSearch.ts
import { ref, type Ref } from 'vue'
import type { GridRow } from '@/stores/dataGridStore'

export type SearchMode = 'Exact' | 'Contains' | 'StartsWith' | 'EndsWith' | 'Regex' | 'Fuzzy'

export interface SearchMatch {
  rowId: string
  columnName: string
  value: string
}

export interface SearchOptions {
  caseSensitive?: boolean
  fuzzyThreshold?: number
}

export function useSearch(rows: Ref<GridRow[]>) {
  const searchTerm = ref('')
  const searchMode = ref<SearchMode>('Contains')
  const searchResults = ref<SearchMatch[]>([])
  const currentResultIndex = ref(-1)

  function searchInRows(term: string, mode: SearchMode, options: SearchOptions = {}) {
    if (!term) {
      searchResults.value = []
      currentResultIndex.value = -1
      return
    }

    const matches: SearchMatch[] = []
    const caseSensitive = options.caseSensitive ?? false
    const fuzzyThreshold = options.fuzzyThreshold ?? 3

    for (const row of rows.value) {
      for (const cell of row.cells) {
        const cellValue = String(cell.value || '')
        let isMatch = false

        const searchValue = caseSensitive ? cellValue : cellValue.toLowerCase()
        const searchTerm = caseSensitive ? term : term.toLowerCase()

        switch (mode) {
          case 'Exact':
            isMatch = caseSensitive ? cellValue === term : cellValue.toLowerCase() === term.toLowerCase()
            break

          case 'Contains':
            isMatch = searchValue.includes(searchTerm)
            break

          case 'StartsWith':
            isMatch = searchValue.startsWith(searchTerm)
            break

          case 'EndsWith':
            isMatch = searchValue.endsWith(searchTerm)
            break

          case 'Regex':
            try {
              const flags = caseSensitive ? '' : 'i'
              const regex = new RegExp(term, flags)
              isMatch = regex.test(cellValue)
            } catch {
              isMatch = false
            }
            break

          case 'Fuzzy':
            isMatch = fuzzyMatch(cellValue, term, fuzzyThreshold)
            break
        }

        if (isMatch) {
          matches.push({
            rowId: row.rowId,
            columnName: cell.columnName,
            value: cellValue
          })
        }
      }
    }

    searchResults.value = matches
    currentResultIndex.value = matches.length > 0 ? 0 : -1
  }

  function fuzzyMatch(text: string, pattern: string, threshold: number): boolean {
    const distance = levenshteinDistance(text.toLowerCase(), pattern.toLowerCase())
    return distance <= threshold
  }

  function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = []

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j
    }

    // Calculate distances
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,      // insertion
            matrix[i - 1][j] + 1       // deletion
          )
        }
      }
    }

    return matrix[b.length][a.length]
  }

  function goToNextResult() {
    if (currentResultIndex.value < searchResults.value.length - 1) {
      currentResultIndex.value++
    }
  }

  function goToPreviousResult() {
    if (currentResultIndex.value > 0) {
      currentResultIndex.value--
    }
  }

  function clearSearch() {
    searchTerm.value = ''
    searchResults.value = []
    currentResultIndex.value = -1
  }

  function isSearchMatch(rowId: string, columnName: string): boolean {
    return searchResults.value.some(
      m => m.rowId === rowId && m.columnName === columnName
    )
  }

  return {
    searchTerm,
    searchMode,
    searchResults,
    currentResultIndex,
    searchInRows,
    goToNextResult,
    goToPreviousResult,
    clearSearch,
    isSearchMatch
  }
}
