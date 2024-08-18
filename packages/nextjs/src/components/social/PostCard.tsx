import { CircleUserRound, MessagesSquare, Redo2, ThumbsUp } from 'lucide-react'
import { FC } from 'react'

import { useMediaQuery } from 'react-responsive'
import styles from './Social.module.scss'

const PostCard: FC<Record<string, string>> = ({ user, text, img }) => {
  const isMobile = useMediaQuery({ maxWidth: 479.98 })

  return (
    <div className={styles.post_card}>
      <div className={styles.post_card__user}>
        <CircleUserRound color="#4f4f4f" />
        <span>{user}</span>
      </div>

      {text && <p>{text}</p>}

      <div className={styles.post_card__image}>
        <img src={img} alt="..." />
      </div>

      <div className={styles.post_card__social}>
        <button>
          <ThumbsUp size={18} color="#4f4f4f" />
          <span>4.1k</span>
        </button>

        <button>
          <MessagesSquare size={18} color="#4f4f4f" />
          <span>255 {!isMobile && 'comments'}</span>
        </button>

        <button>
          <Redo2 size={18} color="#4f4f4f" />
          <span>69 {!isMobile && 'shares'}</span>
        </button>
      </div>
    </div>
  )
}

export default PostCard
