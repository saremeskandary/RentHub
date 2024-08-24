import { FC } from 'react'
import PostCard from './PostCard'

import styles from './Social.module.scss'

const users = [
  { id: 1, username: 'William' },
  { id: 2, username: 'Ashley' },
  { id: 3, username: 'James' },
  { id: 4, username: 'John' }
]

const events = [
  {
    user: 'Admin',
    img: '/social/05.jpg',
    text: ' We are Back in 2024! Join us for Canada Crypto Week from August 11-17, 2024, where thousands of individuals will gather for networking, education, and more. Experience tons of events conveniently located at the prestigious Futurist Conference Venue, accessible with your conference badge!'
  }
]

const Events: FC = () => {
  return (
    <div className={styles.tab_events}>
      <div className={styles.tab_events__table}>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.tab_forum__posts}>
        {events.map((obj) => (
          <PostCard key={obj.img} {...obj} />
        ))}
      </div>
    </div>
  )
}

export default Events
