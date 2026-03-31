import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ExampleState {
  count: number
  increase: () => void
  reset: () => void
}

export const useExampleStore = create<ExampleState>()(
  devtools(
    (set) => ({
      count: 0,
      increase: () =>
        set((state) => ({ count: state.count + 1 }), undefined, 'example/increase'),
      reset: () => set({ count: 0 }, undefined, 'example/reset'),
    }),
    { name: 'ExampleStore' },
  ),
)
