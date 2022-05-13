import create from "zustand";

const useStore = create((set) => ({
	showMenu: true,
  active:'gallery',
  galleryIndex:undefined,
	setShowMenu: (show) =>  
    set((state) => ({
      showMenu: show
    })
  ),
  setActive: (active) =>  
    set((state) => ({
      active
    })
  ),
  setGalleryIndex: (galleryIndex) =>  
    set((state) => ({
      galleryIndex
    })
  ),
}));

export default useStore;
