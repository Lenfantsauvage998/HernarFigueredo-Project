import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Book } from '../types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (book: Book) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
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

      addItem: (book) => {
        const existing = get().items.find((i) => i.service.id === book.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.service.id === book.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({ items: [...get().items, { service: book, quantity: 1 }] })
        }
      },

      removeItem: (bookId) =>
        set({ items: get().items.filter((i) => i.service.id !== bookId) }),

      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.service.id === bookId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.service.price * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'hernan-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
