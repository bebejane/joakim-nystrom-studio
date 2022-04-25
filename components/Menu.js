import styles from "./Menu.module.scss"
import Link from "next/link"
import cn from 'classnames'
import { useState, useEffect } from "react";
import { useRouter } from "next/router"
import { useWindowScrollPosition } from 'rooks'
import { useScrollDirection } from "use-scroll-direction";
import { Twirl as Hamburger } from 'hamburger-react'

export default function Menu({}){
  
  const router = useRouter()
  
  return (
    <div id="menu" className={styles.menu}>
      Menu 
    </div>
  )
}
