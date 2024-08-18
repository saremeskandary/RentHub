import { Metadata } from 'next'
import Listings from './Listings'

export const metadata: Metadata = {
  title: `Listings`
}

export default function ListingsPage() {
  return <Listings />
}
