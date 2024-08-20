import { FC } from "react";
import { CircleUserRound, ShoppingCart } from "lucide-react";

interface IProductDescription {
  title: string;
  text: string;
  price: string;
  date: string;
}

const ProductDescription: FC<IProductDescription | any> = ({ title, text, price, date }) => {
  return (
    <div className="md3:min-h-auto flex h-full min-h-[500px] flex-[0_1_35%] flex-col p-5 md2:flex-[0_1_45%]">
      <div className="mn-3 flex flex-wrap justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-lg font-semibold">{price}</p>
      </div>

      <div className="mb-7 flex gap-5">
        <span className="flex items-center gap-1 font-semibold">
          <label htmlFor="radio1">New</label>
          <input type="radio" id="radio1" name="option" disabled className="cheked-input" />
        </span>

        <span className="flex items-center gap-1 font-semibold">
          <label htmlFor="radio2">Used</label>
          <input type="radio" id="radio2" name="option" disabled checked className="cheked-input" />
        </span>
      </div>

      <p className="mb-7 text-gray-500">{text}</p>

      <div className="mb-7 flex items-center gap-7 md4:flex-col md4:items-start md4:gap-0">
        <div className="flex items-center gap-2">
          <CircleUserRound color="#4f4f4f" />
          <span className="text-base font-semibold">Alex Ford</span>
        </div>

        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`mr-[2px] text-xl text-[#ffc107] ${i > 2 ? "text-gray-300" : ""}`}>
              ★
            </span>
          ))}
          <p className="ml-1">(144)</p>
        </div>
      </div>

      <button className="mt-auto flex w-full items-center justify-center gap-3 rounded bg-gray-400 px-5 py-2 text-white transition-colors hover:bg-gray-300">
        <ShoppingCart size={18} color="#fff" />
        <span>Initiate rental</span>
      </button>
    </div>
  );
};

export default ProductDescription;
