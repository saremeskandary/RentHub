'use client'

import ProductForm from '@/components/create-product/ProductForm'
import Image from 'next/image'
import { useState } from 'react'

import styles from '@/components/create-product/CreateProduct.module.scss'

export default function CreateProduct() {
  const [image, setImage] = useState('')

  return (
    <section className={styles.product_create}>
      <div className="container">
        <div className={`${styles.product_create__body} ${image ? `${styles.image}` : ''}`}>
          {image && (
            <div className={styles.product_create__img}>
              <Image
                src={image ? `/${image}` : ''}
                alt="product-create"
                width={1000}
                height={1000}
              />
            </div>
          )}

          <ProductForm setImage={setImage} />
        </div>
      </div>
    </section>
  )
}
