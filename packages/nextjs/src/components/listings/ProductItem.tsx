import { FC } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import styles from './Listings.module.scss'

const ProductItem: FC<{ img: string; title: string; text: string }> = ({ img, title, text }) => {
  return (
    <Link className={styles.listings__item} href={`/listings/Id`}>
      <div className={styles.listings__item_img}>
        <Image src={img} alt="product" priority width={1000} height={1000} />
      </div>
      <div className={styles.listings__item_text}>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </Link>
  )
}

export default ProductItem
