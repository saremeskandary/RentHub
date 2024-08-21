"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "~~/components/create-product/CreateProduct.module.scss";
import ProductForm from "~~/components/create-product/ProductForm";

export default function CreateProduct() {
  const [image, setImage] = useState("");

  return (
    <section className={styles.product_create}>
      <div className="mx-auto max-w-[1200px] p-3">
        <div className={`${styles.product_create__body} ${image ? `${styles.image}` : ""}`}>
          {image && (
            <div className={styles.product_create__img}>
              <Image src={image ? `/${image}` : ""} alt="product-create" width={1000} height={1000} />
            </div>
          )}

          <ProductForm setImage={setImage} />
        </div>
      </div>
    </section>
  );
}
