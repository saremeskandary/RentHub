import { Metadata } from 'next'
import ProductDetails from './ProductDetails'

export const metadata: Metadata = {
  title: `ProductDetails`
}

export default function ProductDetailsPage() {
  return <ProductDetails />
}
