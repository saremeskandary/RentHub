import { CircleUserRound, ShoppingCart } from 'lucide-react'
import { FC } from 'react'
import styles from './ProductDetails.module.scss'

const ProductDescription: FC = () => {
  return (
    <div className={styles.product_details__description}>
      <div className={styles.product_details__title}>
        <h2>Mona Lisa (original)</h2>
        <p>$800.000.000</p>
      </div>

      <div className={styles.product_details__condition}>
        <span>
          <label htmlFor="radio1">New</label>
          <input type="radio" id="radio1" name="option" disabled />
        </span>

        <span>
          <label htmlFor="radio2">Used</label>
          <input type="radio" id="radio2" name="option" disabled checked />
        </span>
      </div>

      <p className={styles.product_details__text}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae quae sapiente adipisci
        explicabo, nisi obcaecati aperiam mollitia quisquam voluptates quas impedit ipsum ut ab cum
        reiciendis perferendis praesentium sunt dolor iste aliquam quos labore! Voluptatum eius ea
        porro accusamus architecto sequi hic repellendus, fuga nulla, vitae minima praesentium vel
        ut?
      </p>

      <div className={styles.product_details__score}>
        <div className={styles.product_details__user}>
          <CircleUserRound color="#4f4f4f" />
          <span>Alex Ford</span>
        </div>

        <div className={styles.product_details__rating}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`${i < 3 ? `${styles.active}` : ''}`}>
              ★
            </span>
          ))}
          <p>(144)</p>
        </div>
      </div>

      <button>
        <ShoppingCart size={18} color="#fff" />
        <span>Initiate rental</span>
      </button>
    </div>
  )
}

export default ProductDescription
