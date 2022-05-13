import create from "zustand";
const activeToSlug = (active) => active === 'gallery' ? '/' : active === 'assignment' ? `/${assignment.slug}` : active === 'artwork' ? '/artwork' : '/studio'

const useStore = create((set) => ({
	showMenu: true,
  active:'gallery',
  galleryIndex:undefined,
  galleryEndReached:false,
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
  setGalleryEndReached: (galleryEndReached) =>  
    set((state) => ({
      galleryEndReached
    })
  ),
  setGalleryIndex: (galleryIndex) =>  
    set((state) => ({
      galleryIndex
    })
  ),
}));

export default useStore;
