import create from "zustand";

const useStore = create((set) => ({
	backgroundImage: null,
  isTransitioning: false,
	setBackgroundImage: (image) =>  
    set((state) => ({
      backgroundImage: image
    })
  ),
  setIsTransitioning: (isTransitioning) =>  
    set((state) => ({
      isTransitioning
    })
  )
}));

export default useStore;
