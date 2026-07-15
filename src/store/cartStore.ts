import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Book, BookFormat } from '../types'

export const unitPrice = (book: Book, format: BookFormat) =>
  format === 'EPUB' ? (book.epub_price ?? book.price) : book.price

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (book: Book, format?: BookFormat) => void
  removeItem: (bookId: string, format: BookFormat) => void
  updateQuantity: (bookId: string, format: BookFormat, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (book, format = 'FISICO') => {
        const existing = get().items.find((i) => i.service.id === book.id && i.format === format)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.service.id === book.id && i.format === format
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, { service: book, quantity: 1, format }] })
        }
      },

      removeItem: (bookId, format) =>
        set({ items: get().items.filter((i) => !(i.service.id === bookId && i.format === format)) }),

      updateQuantity: (bookId, format, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId, format)
          return
        }
        set({
          items: get().items.map((i) =>
            i.service.id === bookId && i.format === format ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + unitPrice(i.service, i.format) * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'hernan-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
