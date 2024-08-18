import { HandCoins, ImagePlus, LetterText, Plus, Text } from 'lucide-react'
import { FC } from 'react'
import styles from './CreateProduct.module.scss'

const ProductForm: FC<{ setImage: (i: string) => void }> = ({ setImage }) => {
  return (
    <div className={styles.product_create__form}>
      <form>
        <div className={styles.product_create__input}>
          <ImagePlus size={20} color="#9095a9" />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) setImage(e.target.files[0].name)
            }}
            id="file"
            type="file"
            className="input"
          />
          <label htmlFor="file">Add image</label>
        </div>

        <div className={styles.product_create__input}>
          <LetterText size={20} color="#9095a9" />
          <input type="text" className="input" placeholder="Title" />
        </div>

        <div className={styles.product_create__input}>
          <Text size={20} color="#9095a9" />
          <textarea className="input" placeholder="Text" rows={7} />
        </div>

        <div className={styles.product_create__input}>
          <HandCoins size={20} color="#9095a9" />
          <input type="text" className="input" placeholder="Price" />
        </div>

        <div className={styles.product_create__condition}>
          <span>
            <label htmlFor="radio1">New</label>
            <input type="radio" id="radio1" name="option" />
          </span>

          <span>
            <label htmlFor="radio2">Used</label>
            <input type="radio" id="radio2" name="option" />
          </span>
        </div>
      </form>

      <button>
        <Plus size={20} color="#fff" />
        <span>Create a new ad</span>
      </button>
    </div>
  )
}

export default ProductForm
