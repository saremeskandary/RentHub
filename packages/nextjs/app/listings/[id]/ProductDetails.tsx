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
    <section className="pb-5 pt-32">
      <div className="mx-auto max-w-[1200px] px-3">
        <div className="flex rounded bg-white shadow-custom md3:flex-col">
          <div className="relative flex-[0_1_65%] overflow-hidden rounded md2:flex-[0_1_55%] md3:pb-[70%]">
            <Image
              src={data ? data?.img : ""}
              alt="product-details"
              width={1000}
              height={1000}
              className="absolute left-0 top-0 h-full w-full object-cover object-center"
            />
          </div>

          <ProductDescription {...data} />
        </div>
      </div>
    </section>
  );
}
