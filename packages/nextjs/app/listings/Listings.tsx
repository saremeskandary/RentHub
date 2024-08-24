"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import ListingsFilter from "~~/components/listings/ListingsFilter";
import ProductItem from "~~/components/listings/ProductItem";
import { productsService } from "~~/services/products.service";

export default function Listings() {
  const [visible, setVisible] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: 767.98 });

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsService.getProducts(),
  });

  return (
    <div className="flex pt-16 md3:pt-10">
      <ListingsFilter visible={visible} setVisible={setVisible} isMobile={isMobile} />

      <div>
        {isMobile && (
          <div className="flex justify-between gap-2 p-[60px_20px_0_20px]">
            <div className="mb-3 flex items-center gap-3 rounded border px-5 py-3 md3:m-0 md4:p-3">
              <Search size={20} color="#9095a9" />
              <input type="text" className="block w-full appearance-none text-sm outline-none" placeholder="Search" />
            </div>

            <button
              onClick={() => setVisible(true)}
              className="flex items-center gap-2 rounded bg-gray-400 px-5 text-white transition-colors hover:bg-gray-300 md4:px-3"
            >
              <SlidersHorizontal size={20} color="#fff" />
              <span className="mb-[3px] md4:hidden">Filters</span>
            </button>
          </div>
        )}

        <div className="ml-[350px] grid flex-[1_1_100%] grid-cols-4 gap-5 p-[60px_20px] xl:grid-cols-5 xl:gap-7 md1:grid-cols-3 md2:ml-[300px] md2:grid-cols-2 md3:m-0 md3:p-[40px_20px] md4:grid-cols-1">
          {data && data.map(obj => <ProductItem key={obj.id} {...obj} />)}
        </div>
      </div>
    </div>
  );
}
