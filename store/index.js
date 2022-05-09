import create from "zustand";

const useStore = create((set) => ({
	showMenu: true,
	setShowMenu: (show) =>  
    set((state) => ({
      showMenu: show
    })
  ),
}));

export default useStore;
