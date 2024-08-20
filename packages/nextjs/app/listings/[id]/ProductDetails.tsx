
"use client"
import Image from "next/image";
import { useEffect } from "react";
import ProductDescription from "~~/components/product-details/ProductDescription";
import styles from "~~/components/product-details/ProductDetails.module.scss";
<<<<<<< HEAD
import { productsService } from "~~/services/products.service";

export default function ProductDetails() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productsService.getProductsById(id),
  });

  return (
    <section className={styles.product_details}>
      <div className="mx-auto max-w-[1200px] p-3">
        <div className={styles.product_details__body}>
          <div className="h-[100vh]">
            <Image
              src={data ? data.img : ""}
              alt="product-details"
              width={1000}
              height={1000}
              className="aspect-video !h-full !object-cover"
            />
          </div>
          <ProductDescription {...data} />
=======
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
>>>>>>> 6f9488329e8e3251ccf018e5a46345960fdf9364
        </div>
      </div>
    </section>
  );
}
