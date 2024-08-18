import Image from "next/image";
import ProductDescription from "~~/components/product-details/ProductDescription";
import styles from "~~/components/product-details/ProductDetails.module.scss";

export default function ProductDetails() {
  return (
    <section className={styles.product_details}>
      <div className="container">
        <div className={styles.product_details__body}>
          <div className={styles.product_details__img}>
            <Image src="/product.jpg" alt="product-details" width={1000} height={1000} />
          </div>

          <ProductDescription />
        </div>
      </div>
    </section>
  );
}
