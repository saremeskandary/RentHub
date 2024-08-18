'use client'

import { ArrowLeftRight, House, MessageCircle, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FC } from 'react'

import styles from './Footer.module.scss'

const items = [
  {
    link: '/',
    title: 'Home',
    icon: <House color="#9095a9" />
  },
  {
    link: '/listings',
    title: 'Listings',
    icon: <ArrowLeftRight color="#9095a9" />
  },
  {
    link: '/socialfi',
    title: 'SocialFi',
    icon: <MessageCircle color="#9095a9" />
  },
  {
    link: '/profile',
    title: 'Profile',
    icon: <User color="#9095a9" />
  }
]

const Footer: FC = () => {
  const pathname = usePathname()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footer__body}>
          {items.map((obj) => (
            <Link
              href={obj.link}
              className={`${styles.footer__item} ${pathname === `${obj.link}` ? `${styles.active}` : ''}`}
              key={obj.title}
            >
              {obj.icon}
              <span>{obj.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
