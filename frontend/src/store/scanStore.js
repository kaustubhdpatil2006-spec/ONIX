import { create } from 'zustand'

const useScanStore = create((set) => ({
  // --- STATE ---
  images: [],
  isScanning: false,
  results: null,

  // NEW: keeps every completed scan, most recent first.
  // Not persisted on purpose for now — we'll swap this for a real
  // "fetch scan history from backend" call later. Mock data lives here
  // just so Dashboard has something to render before that exists.
  history: [
    {
      id: 'mock-1',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs ago
      images: [],
      rules: [
        { id: 1, name: 'MRP Declaration', status: 'pass' },
        { id: 2, name: 'Net Quantity', status: 'pass' },
        { id: 3, name: "Manufacturer's Name & Address", status: 'pass' },
        { id: 4, name: 'Consumer Care Details', status: 'pass' },
        { id: 5, name: 'Date of Manufacture', status: 'pass' },
        { id: 6, name: 'Font Size Compliance', status: 'pass' },
      ],
    },
    {
      id: 'mock-2',
      date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // yesterday
      images: [],
      rules: [
        { id: 1, name: 'MRP Declaration', status: 'pass' },
        { id: 2, name: 'Net Quantity', status: 'fail' },
        { id: 3, name: "Manufacturer's Name & Address", status: 'fail' },
        { id: 4, name: 'Consumer Care Details', status: 'pass' },
        { id: 5, name: 'Date of Manufacture', status: 'pass' },
        { id: 6, name: 'Font Size Compliance', status: 'fail' },
      ],
    },
  ],

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

  // UPDATED: now also pushes the completed scan into history
  setResults: (data) =>
    set((state) => {
      const scanRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        images: data.images,
        rules: data.rules,
      }
      return {
        results: data,
        isScanning: false,
        history: [scanRecord, ...state.history], // newest first
      }
    }),
}))

export default useScanStore