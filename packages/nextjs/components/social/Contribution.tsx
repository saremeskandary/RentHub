import { FC } from 'react'
import PostCard from './PostCard'

import styles from './Social.module.scss'

const contributions = [
  { user: 'Alice', img: '/social/01.png', text: 'Specialized replaced the tried-and-true horst link with a flexing section of the frame to reduce weight and let the rear of the bike move more freely, which makes the bike even more responsive to your weight. The Stumpjumper is poppy, but doesn’t handle chunk as well. Expect to be a little choosey on techier lines due to the shorter travel.' },
  { user: 'Michale', img: '/social/02.png', text: 'This is the basic turning stroke. If you do repeated forward strokes on the same side of the boat, you will notice that the boat slowly turns the other way. The sweep stroke simply exaggerates this effect. The sweep is the same as a forward stroke, except that you alter the blade path so that it carves a much wider arc on the side of the boat. Sweep strokes on the right side of the boat will turn the boat left and left-side sweep strokes will turn the boat right.' },
  { user: 'Oleg', img: '/social/03.png', text: 'Installing Retractable Transom Straps Learn how to install retractable transom tie-down straps and enhance convenience and safety when trailering your boat.' },
  {
    user: 'Nina',
    img: '/social/04.png',
    text: 'Lawn Mower Air Filter Soaked in Oil: Here’s What to Do Before we get into the weeds, I will just say that you shouldn’t freak out if you find your air filter is soaked in oil. Yes, it is a bit of a mess. But your mower is not ruined, and it really is quite an easy and affordable fix. Here’s what you’re going to want to do : Safety First'
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
