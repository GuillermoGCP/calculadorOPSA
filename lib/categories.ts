export const DEFAULT_CATEGORIES = [
  'Relleno',
  'Masa',
  'Horneado',
  'Envasado y Etiquetado',
  'Mano de obra',
]

export const getStoredCategories = (): string[] => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES
  const stored = localStorage.getItem('categories')
  return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES
}

export const saveCategories = (cats: string[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('categories', JSON.stringify(cats))
}
