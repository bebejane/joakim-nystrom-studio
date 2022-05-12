import create from "zustand";

const useStore = create((set) => ({
	showMenu: true,
  active:'gallery',
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
}));

export default useStore;
