import Router, { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

const usePreviousRoute = () => {
  
  const router = useRouter()
  const [prevRoute, setPrevRoute] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem('previousRoute') : null)

	useEffect(()=>{
    
    const prevRoute = localStorage.getItem('currentRoute');
    if (prevRoute === router.asPath) return
    console.log(prevRoute, '>', router.asPath, )

    localStorage.setItem('previousRoute', prevRoute)
    localStorage.setItem("currentRoute", router.asPath);
    setPrevRoute(prevRoute)
	}, [router.asPath])	

  return prevRoute
};

export default usePreviousRoute