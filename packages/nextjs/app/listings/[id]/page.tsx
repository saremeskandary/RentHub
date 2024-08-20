<<<<<<< HEAD
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `ProductDetails`,
};

export default function ProductDetailsPage() {
  return <ProductDetails />;
}
=======
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
>>>>>>> 6f9488329e8e3251ccf018e5a46345960fdf9364
