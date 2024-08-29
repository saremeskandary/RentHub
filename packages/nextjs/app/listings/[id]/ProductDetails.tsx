"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductDescription from "~~/components/product-details/ProductDescription";
import { productsService } from "~~/services/products.service";

export default function ProductDetails() {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["products", id],
    queryFn: () => productsService.getProductsById(id),
  });

  return (
    <section className="flex flex-[1_1_100%] items-center pb-5 pt-28">
      <div className="mx-auto max-w-[1200px] p-3 md2:max-w-[800px]">
        <div className="flex rounded bg-white shadow-custom md2:flex-col">
          <div className="flex-[0_1_55%] overflow-hidden rounded-[5px_0_0_5px] md2:rounded-[5px_5px_0_0]">
            <Image src={data ? data.img : ""} alt="product-details" width={1000} height={1000} layout="responsive" />
          </div>

          <ProductDescription {...data} />
        </div>
      </div>
    </section>
  );
}
