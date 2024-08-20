import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

const ProductItem: FC<{ id: number; img: string; title: string; text: string }> = ({ id, img, title, text }) => {
  return (
    <Link
      className="overflow-hidden rounded bg-white shadow-custom transition-transform hover:-translate-y-2"
      href={`/listings/${id}`}
    >
      <div className="relative pb-[80%]">
        <Image
          src={img}
          alt="product"
          priority
          width={1000}
          height={1000}
          className="absolute left-0 top-0 h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="mb-2 text-base font-semibold">{title}</h2>
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </Link>
  );
};

export default ProductItem;
