import { Settings, Wallet } from 'lucide-react'
import Link from 'next/link'

import styles from '@/components/profile/Profile.module.scss'

export default function Profile() {
  return (
    <section className={styles.profile}>
      <Link href="/settings">
        <Settings size={24} color="#9095a9" />
        <span>Settings</span>
      </Link>

      <Link href="/wallet">
        <Wallet size={24} color="#9095a9" />
        <span>Wallet</span>
      </Link>
    </section>
  )
}
