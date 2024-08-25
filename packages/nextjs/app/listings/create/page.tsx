import { Metadata } from 'next'
import CreateProduct from './CreateAd'

export const metadata: Metadata = {
  title: `CreateAd`
}

export default function CreateAdPage() {
  return <CreateProduct />
}
