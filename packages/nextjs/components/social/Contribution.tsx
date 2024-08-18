import { FC } from 'react'
import PostCard from './PostCard'

import styles from './Social.module.scss'

const contributions = [
  { user: 'Alice', img: '/social/01.jpg', text: '' },
  { user: 'Michale', img: '/social/02.jpg', text: 'Lorem ipsum dolor sit amet.' },
  { user: 'Oleg', img: '/social/03.jpg', text: '' },
  {
    user: 'Nina',
    img: '/social/04.jpg',
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, perferendis!'
  }
]

const Contribution: FC = () => {
  return (
    <div>
      <div className={styles.tab_forum__posts}>
        {contributions.map((obj) => (
          <PostCard key={obj.img} {...obj} />
        ))}
      </div>
    </div>
  )
}

export default Contribution
