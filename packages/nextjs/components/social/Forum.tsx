import { ChevronDown, Search } from 'lucide-react'
import { FC, useEffect, useRef, useState } from 'react'
import PostCard from './PostCard'

import styles from './Social.module.scss'

const sort = ['Photography', 'Outdoors']

const forum = [
  { user: 'Alice', img: '/social/01.jpg', text: '' },
  { user: 'Michale', img: '/social/02.jpg', text: 'Lorem ipsum dolor sit amet.' },
  { user: 'Oleg', img: '/social/03.jpg', text: '' },
  {
    user: 'Nina',
    img: '/social/04.jpg',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, perferendis!'
  }
]

const Forum: FC = () => {
  const sortRef = useRef<HTMLDivElement>(null)
  const [listVisible, setListVisible] = useState<boolean>(false)
  const [sortType, setSortType] = useState<string>(sort[0])

  useEffect(() => {
    const closeSort = (e: MouseEvent) => {
      if (sortRef.current && !e.composedPath().includes(sortRef.current)) setListVisible(false)
    }
    document.body.addEventListener('click', closeSort)
    return () => document.body.removeEventListener('click', closeSort)
  }, [])

  return (
    <div className={styles.tab_forum}>
      <div className={styles.tab_forum__filter}>
        <div className={styles.tab_forum__search}>
          <Search size={20} color="#9095a9" />
          <input type="text" className="input" placeholder="Search" />
        </div>

        <div ref={sortRef} className={styles.tab_forum__sort}>
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
      </div>

      <div className={styles.tab_forum__posts}>
        {forum.map((obj) => (
          <PostCard key={obj.img} {...obj} />
        ))}
      </div>
    </div>
  )
}

export default Forum
