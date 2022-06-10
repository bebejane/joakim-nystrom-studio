import "swiper/css";
import styles from './ArtworkGallery.module.scss'
import { Image } from "react-datocms"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useRef, useEffect } from 'react';
import { use100vh } from 'react-div-100vh'

export default function ArtworkGallery({ artwork, onClose, index = 0 }) {
  
  const swiperRef = useRef()
  const [realIndex, setRealIndex] = useState(index)
  const [title, setTitle] = useState()
  const current = artwork[realIndex]
  const height = use100vh()

  useEffect(() => setTitle(artwork[realIndex].title), [realIndex])

  return (
    <div className={styles.artworkGallery} style={{maxHeight:height}}>
      <div className={styles.back} onClick={() => swiperRef.current.slidePrev()}>←</div>
      <div className={styles.images} onClick={() => swiperRef?.current?.slideNext()}>
        <Swiper
          loop={true}
          spaceBetween={500}
          slidesPerView={1}
          initialSlide={index}
          onSlideChange={({ realIndex }) => setRealIndex(realIndex)}
          onSwiper={(swiper) => swiperRef.current = swiper}
        >
          {artwork.map(({image}, idx) =>
            <SwiperSlide key={idx} className={styles.slide}>
              {<Image
                className={styles.image}
                pictureClassName={styles.picture}
                data={image.responsiveImage}
                lazyLoad={false}
                usePlaceholder={false}
              />}
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className={styles.forward} onClick={() => swiperRef.current.slideNext()}>→</div>
      <div className={styles.caption}>
        {current && 
          <>
            Edition: {current.edition}<br />
            Size: {current.dimensions}<br />
            Prize: {current.price}<br />
            {current.sold ?
              <>Sold</>
            :
              <a
                href={`mailto:info@joakimnystrom.com${current.title ? `?subject=${encodeURIComponent(current.title)}` : ''}`}
                onClick={e => e.stopPropagation()}
              >
                Buy
              </a>
            }
          </>
        }
      </div>
      <div className={styles.close} onClick={onClose}>×</div>
    </div>
  )
}