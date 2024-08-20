
"use client"
import Image from "next/image";
import { useEffect } from "react";
import ProductDescription from "~~/components/product-details/ProductDescription";
import styles from "~~/components/product-details/ProductDetails.module.scss";
import products from "~~/components/staticdata/Products";

interface ProductDetailsProps {
  params: {
    id: number;
  };
}

export default function ProductDetails({ params }: ProductDetailsProps) {
useEffect(() => {
  console.log("dqwdq", params)
}, [params])

  return (
    <section className={styles.product_details}>
      <div className="container">
        <div className={styles.product_details__body}>
          <div className="h-[100vh]">
            <Image
              src={products[params?.id].img}
              alt="product-details"
              width={1000}
              height={1000}
              className="!object-cover aspect-video !h-full"
            />
          </div>
          {/* Pass the slug to ProductDescription as a prop */}
          <ProductDescription id={params.id} />
        </div>
      </div>
    </section>
  );
}
