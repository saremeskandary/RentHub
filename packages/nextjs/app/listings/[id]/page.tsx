import { Metadata } from 'next';
import ProductDetails from './ProductDetails';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Product Details'
};

interface ProductDetailsProps {
  params: {
    id: number;
  };
}

const ProductDetailsPage: FC<ProductDetailsProps> = ({ params }) => {
  return <ProductDetails params={params} />;
};

export default ProductDetailsPage;
