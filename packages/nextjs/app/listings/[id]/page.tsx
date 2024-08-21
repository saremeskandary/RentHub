import ProductDetails from "./ProductDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `ProductDetails`,
};

export default function ProductDetailsPage() {
  return <ProductDetails />;
}
