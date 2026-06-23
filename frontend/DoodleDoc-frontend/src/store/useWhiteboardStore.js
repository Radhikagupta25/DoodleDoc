import { create } from "zustand";

const useWhiteboardStore = create((set) => ({
    tool: "pen",
    color: "#3E627B",
    brushSize: 4,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    fontSize: 20,
    fontFamily: "Poppins",
    deleteSelected: () => { },
    hasSelection: false,
    undo: () => { },
    redo: () => { },
    saveBoard: () => { },
    setSaveBoard: (fn) =>
        set({
            saveBoard: fn,
        }),
    setUndo: (fn) =>
        set({
            undo: fn,
        }),
    setRedo: (fn) =>
        set({
            redo: fn,
        }),
    setHasSelection: (value) =>
        set({
            hasSelection: value,
        }),
    setDeleteSelected: (fn) =>
        set({
            deleteSelected: fn,
        }),
    setFontSize: (fontSize) =>
        set({ fontSize }),
    setFontFamily: (fontFamily) =>
        set({ fontFamily }),
    setTool: (tool) => set({ tool }),
    setColor: (color) => set({ color }),
    setBrushSize: (brushSize) =>
        set({ brushSize }),
    setFontFamily: (fontFamily) =>
        set({ fontFamily }),
    setFontSize: (fontSize) =>
        set({ fontSize }),
    toggleBold: () =>
        set((state) => ({
            isBold: !state.isBold,
        })),
    toggleItalic: () =>
        set((state) => ({
            isItalic: !state.isItalic,
        })),
    toggleUnderline: () =>
        set((state) => ({
            isUnderline: !state.isUnderline,
        })),
}));

export default useWhiteboardStore;