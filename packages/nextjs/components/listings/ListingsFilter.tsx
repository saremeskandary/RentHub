import { ChevronDown, Plus, Search, X } from 'lucide-react'
import { FC, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import styles from './Listings.module.scss'

const sort: string[] = ['Distance (ASC)', 'Distance (DESC)', 'Price (ASC)', 'Price (DESC)']

const categories: string[] = [
  'Electronics',
  'Clothing',
  'Home',
  'Books',
  'Toys',
  'Beauty',
  'Sports',
  'Automotive',
  'Health',
  'Office'
]

const ListingsFilter: FC<{
  visible: boolean
  setVisible: (i: boolean) => void
  isMobile: boolean
}> = ({ visible, setVisible, isMobile }) => {
  const sortRef = useRef<HTMLDivElement>(null)
  const [listVisible, setListVisible] = useState<boolean>(false)
  const [sortType, setSortType] = useState<string>(sort[0])
  const [category, setCategory] = useState<string>('')

  useEffect(() => {
    const closeSort = (e: MouseEvent) => {
      if (sortRef.current && !e.composedPath().includes(sortRef.current)) setListVisible(false)
    }
    document.body.addEventListener('click', closeSort)
    return () => document.body.removeEventListener('click', closeSort)
  }, [])

  return (
    <div className={`${styles.listings__filter} ${visible ? `${styles.active}` : ''}`}>
      {isMobile ? (
        <button onClick={() => setVisible(false)}>
          <X size={20} color="#9095a9" />
        </button>
      ) : (
        <div className={styles.listings__search}>
          <Search size={20} color="#9095a9" />
          <input type="text" className="input" placeholder="Search" />
        </div>
      )}

      <Link href="/listings/create" className={styles.listings__create}>
        <Plus size={20} color="#fff" />
        <span>Create a new ad</span>
      </Link>

      <div ref={sortRef} className={styles.listings__sort}>
        <label onClick={() => setListVisible(!listVisible)}>
          <div>
            <span>Sort by: </span>
            <span>{sortType}</span>
          </div>
          <ChevronDown
            size={20}
            color="#9095a9"
            className={listVisible ? `${styles.active}` : ''}
          />
        </label>
        {listVisible && (
          <ul>
            {sort.map((item) => (
              <li
                className={sortType === item ? `${styles.active}` : ''}
                onClick={() => {
                  setSortType(item)
                  setListVisible(false)
                }}
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.listings__categories}>
        <h2>Categories</h2>
        <ul>
          {categories.map((item) => (
            <li
              onClick={() => setCategory(item)}
              key={item}
              className={category === item ? `${styles.active}` : ''}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ListingsFilter
