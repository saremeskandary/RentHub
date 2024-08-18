'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import ListingsFilter from '@/components/listings/ListingsFilter'
import ProductItem from '@/components/listings/ProductItem'

import styles from '@/components/listings/Listings.module.scss'

const products = [
  {
    img: '/products/bike.jpg',
    title: 'Bike',
    text: 'I sell bikes, catering to cycling enthusiasts of all levels. My focus is on providing quality bicycles, reliable accessories, and excellent customer service.'
  },
  {
    img: '/products/boat.jpg',
    title: 'Boat',
    text: 'I sell boats, offering a range of options for those who love being on the water. Whether for leisure, fishing, or sport, my boats are selected for their quality, performance, and durability.'
  },
  {
    img: '/products/kayak.jpg',
    title: 'Kayak',
    text: 'I sell kayaks, providing options for both beginners and experienced paddlers. My kayaks are chosen for their stability, durability, and performance, making them ideal for exploring lakes, rivers, or coastal waters.'
  },
  {
    img: '/products/lawnmover.jpeg',
    title: 'Lawnmover',
    text: 'I sell lawnmowers, offering reliable and efficient models to keep your lawn looking its best. Whether you need a mower for a small yard or a larger property, I have options that combine power and ease of use.'
  },
  {
    img: '/products/skis.jpg',
    title: 'Skis',
    text: 'I sell skis, offering a range of options for winter sports enthusiasts. Whether you`re a beginner or an experienced skier, my selection includes skis that are designed for different terrains and skill levels.'
  }
]

export default function Listings() {
  const [visible, setVisible] = useState<boolean>(false)
  const isMobile = useMediaQuery({ maxWidth: 767.98 })

  return (
    <div className={styles.listings}>
      <ListingsFilter visible={visible} setVisible={setVisible} isMobile={isMobile} />

      <div>
        {isMobile && (
          <div className={styles.listings__body}>
            <div className={styles.listings__search}>
              <Search size={20} color="#9095a9" />
              <input type="text" className="input" placeholder="Search" />
            </div>

            <button onClick={() => setVisible(true)}>
              <SlidersHorizontal size={20} color="#fff" />
              <span>Filters</span>
            </button>
          </div>
        )}

        <div className={styles.listings__products}>
          {products.map((obj) => (
            <ProductItem key={obj.text} {...obj} />
          ))}
        </div>
      </div>
    </div>
  )
}
