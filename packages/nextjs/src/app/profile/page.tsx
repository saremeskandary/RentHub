import { Metadata } from 'next'
import Profile from './Profile'

export const metadata: Metadata = {
  title: `Profile`
}

export default function ProfilePage() {
  return <Profile />
}
