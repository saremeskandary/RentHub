"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import ListingsFilter from "~~/components/listings/ListingsFilter";
import ProductItem from "~~/components/listings/ProductItem";
import products from "../../components/staticdata/Products"

<<<<<<< HEAD
const products = [
  {
    img: "/products/bike.jpg",
    title: "Bike",
    id: 0,
    text: "I sell bikes, catering to cycling enthusiasts of all levels. My focus is on providing quality bicycles, reliable accessories, and excellent customer service.",
  },
  {
    img: "/products/boat.jpg",
    title: "Boat",
    id: 1,
    text: "I sell boats, offering a range of options for those who love being on the water. Whether for leisure, fishing, or sport, my boats are selected for their quality, performance, and durability.",
  },
  {
    img: "/products/kayak.jpg",
    title: "Kayak",
    id: 2,
    text: "I sell kayaks, providing options for both beginners and experienced paddlers. My kayaks are chosen for their stability, durability, and performance, making them ideal for exploring lakes, rivers, or coastal waters.",
  },
  {
    img: "/products/lawnmover.jpeg",
    title: "Lawnmover",
    id: 3,
    text: "I sell lawnmowers, offering reliable and efficient models to keep your lawn looking its best. Whether you need a mower for a small yard or a larger property, I have options that combine power and ease of use.",
  },
  {
    img: "/products/skis.jpg",
    title: "Skis",
    id: 4,
    text: "I sell skis, offering a range of options for winter sports enthusiasts. Whether you`re a beginner or an experienced skier, my selection includes skis that are designed for different terrains and skill levels.",
  },
];
=======
// const products = [
//   {
//     img: "/products/bike.jpg",
//     title: "Bike",
//     text: "I sell bikes, catering to cycling enthusiasts of all levels. My focus is on providing quality bicycles, reliable accessories, and excellent customer service.",
//   },
//   {
//     img: "/products/boat.jpg",
//     title: "Boat",
//     text: "I sell boats, offering a range of options for those who love being on the water. Whether for leisure, fishing, or sport, my boats are selected for their quality, performance, and durability.",
//   },
//   {
//     img: "/products/kayak.jpg",
//     title: "Kayak",
//     text: "I sell kayaks, providing options for both beginners and experienced paddlers. My kayaks are chosen for their stability, durability, and performance, making them ideal for exploring lakes, rivers, or coastal waters.",
//   },
//   {
//     img: "/products/lawnmover.jpeg",
//     title: "Lawnmover",
//     text: "I sell lawnmowers, offering reliable and efficient models to keep your lawn looking its best. Whether you need a mower for a small yard or a larger property, I have options that combine power and ease of use.",
//   },
//   {
//     img: "/products/skis.jpg",
//     title: "Skis",
//     text: "I sell skis, offering a range of options for winter sports enthusiasts. Whether you`re a beginner or an experienced skier, my selection includes skis that are designed for different terrains and skill levels.",
//   },
// ];
>>>>>>> 6f9488329e8e3251ccf018e5a46345960fdf9364

export default function Listings() {
  const [visible, setVisible] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: 767.98 });

<<<<<<< HEAD
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsService.getProducts(),
  });

=======
>>>>>>> 6f9488329e8e3251ccf018e5a46345960fdf9364
  return (
    <div className="flex pt-16">
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

        <div className="xl:grid-cols-5 xl:gap-7 ml-[350px] grid flex-[1_1_100%] grid-cols-4 gap-5 p-[60px_20px] md1:grid-cols-3 md2:ml-[300px] md2:grid-cols-2 md3:m-0 md3:p-[40px_20px] md4:grid-cols-1">
          {products.map(obj => (
            <ProductItem key={obj.text} {...obj} />
          ))}
        </div>
      </div>
    </div>
  );
}
