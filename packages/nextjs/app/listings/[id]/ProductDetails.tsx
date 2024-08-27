"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductDescription from "~~/components/product-details/ProductDescription";
import styles from "~~/components/product-details/ProductDetails.module.scss";
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
          <div className="flex-[0_1_55%]">
            <Image src={data ? data.img : ""} alt="product-details" width={1000} height={1000} layout="responsive" />
          </div>

          <ProductDescription {...data} />
        </div>
      </div>
    </section>
  );
}
