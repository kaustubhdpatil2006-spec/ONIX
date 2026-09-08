import { create } from 'zustand'

// This store holds images picked for the CURRENT scan session.
// Unlike authStore, we do NOT persist this — a scan session should
// reset when the app reloads.
const useScanStore = create((set) => ({
  // --- STATE ---
  images: [],       // Array of { id, file, previewUrl }
  isScanning: false,
  results: null,    // Will hold backend response later (Step 4)

  // --- ACTIONS ---
  addImages: (newFiles) =>
    set((state) => {
      const mapped = newFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }))
      return { images: [...state.images, ...mapped] }
    }),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  clearImages: () => set({ images: [], results: null }),

  setScanning: (value) => set({ isScanning: value }),

  setResults: (data) => set({ results: data, isScanning: false }),
}))

export default useScanStore