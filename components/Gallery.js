import "swiper/css";
import styles from './Gallery.module.scss'
import { Image } from "react-datocms"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState, useRef, useEffect } from 'react';

export default function Gallery({ images, onClose, index = 0 }) {

  const swiperRef = useRef()
  const [realIndex, setRealIndex] = useState(index)
  const [title, setTitle] = useState()

  useEffect(() => setTitle(images[realIndex].title), [realIndex])

  if (!images) return null

  return (
    <div className={styles.gallery}>
      <Swiper
        className={styles.images}
        loop={true}
        centeredSlides={true}
        spaceBetween={0}
        slidesPerView={3}
        slideNextClass={styles.next}
        slidePrevClass={styles.prev}
        centeredSlidesBounds={true}
        initialSlide={index}
        onSlideChange={({ realIndex }) => setRealIndex(realIndex)}
        onSwiper={(swiper) => swiperRef.current = swiper}
      >
        {images.map((image, idx) =>
          <SwiperSlide key={idx} className={styles.slide}>
            <Image
              className={styles.image}
              pictureClassName={styles.picture}
              data={image.responsiveImage}
              usePlaceholder={false}
            />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  )
}