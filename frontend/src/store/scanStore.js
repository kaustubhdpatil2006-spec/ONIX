import { create } from 'zustand'
import useAuthStore from './authStore'

const useScanStore = create((set) => ({
  images: [],
  isScanning: false,
  results: null,

  history: [
    {
      id: 'mock-1',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      officerName: 'Aditri Patil', // NEW
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
      date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      officerName: 'Rahul Verma', // NEW
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

  addImages: (newFiles) =>
    set((state) => {
      const mapped = newFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }))
      return { images: [...state.images, ...mapped] }
    }),
  setImages: (newFiles) =>
  set({
    images: newFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    })),
  }),  

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  clearImages: () => set({ images: [], results: null }),

  setScanning: (value) => set({ isScanning: value }),

  setResults: (data) =>
    set((state) => {
      const currentUser = useAuthStore.getState().user // read auth store directly, no hook needed here
      const scanRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        officerName: currentUser?.name || 'Unknown',
        images: data.images,
        rules: data.rules,
      }
      return {
        results: data,
        isScanning: false,
        history: [scanRecord, ...state.history],
      }
    }),
}))

export default useScanStore