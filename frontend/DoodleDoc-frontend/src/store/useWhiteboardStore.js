import { create } from "zustand";

const useWhiteboardStore = create((set) => ({
    tool: "pen",
    color: "#3E627B",
    brushSize: 4,
    fontFamily: "Inter",
    fontSize: 16,
    isBold: false,
    isItalic: false,
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
}));

export default useWhiteboardStore;