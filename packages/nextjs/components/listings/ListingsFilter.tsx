import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus, Search, X } from "lucide-react";

const sort: string[] = ["Distance (ASC)", "Distance (DESC)", "Price (ASC)", "Price (DESC)"];

const categories: string[] = [
  "Electronics",
  "Clothing",
  "Home",
  "Books",
  "Toys",
  "Beauty",
  "Sports",
  "Automotive",
  "Health",
  "Office",
];

const ListingsFilter: FC<{
  visible: boolean;
  setVisible: (i: boolean) => void;
  isMobile: boolean;
}> = ({ visible, setVisible, isMobile }) => {
  const sortRef = useRef<HTMLDivElement>(null);
  const [listVisible, setListVisible] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>(sort[0]);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    const closeSort = (e: MouseEvent) => {
      if (sortRef.current && !e.composedPath().includes(sortRef.current)) setListVisible(false);
    };
    document.body.addEventListener("click", closeSort);
    return () => document.body.removeEventListener("click", closeSort);
  }, []);

  return (
    <div
      className={`scrollbar-none fixed left-0 top-0 z-10 h-full w-[350px] overflow-auto bg-white p-[125px_20px_20px_20px] shadow-center md2:w-[300px] md3:-left-full md3:w-full md3:transition-all ${visible ? "md3:left-0" : ""}`}
    >
      {isMobile ? (
        <div className="mb-5 w-full text-right">
          <button onClick={() => setVisible(false)}>
            <X size={20} color="#9095a9" />
          </button>
        </div>
      ) : (
        <div className="mb-3 flex items-center gap-3 rounded border px-5 py-3">
          <Search size={20} color="#9095a9" />
          <input type="text" className="block w-full appearance-none text-sm outline-none" placeholder="Search" />
        </div>
      )}

      <Link
        href="/listings/create"
        className="mb-5 flex items-center justify-center gap-3 rounded bg-green-500 py-2 text-white transition hover:bg-green-600"
      >
        <Plus size={20} color="#fff" />
        <span>Create a new ad</span>
      </Link>

      <div ref={sortRef} className="mb-5 border-y py-5">
        <label
          onClick={() => setListVisible(!listVisible)}
          className="flex cursor-pointer items-center justify-between gap-5 rounded border bg-white px-5 py-3"
        >
          <div>
            <span className="font-semibold text-gray-400">Sort by: </span>
            <span>{sortType}</span>
          </div>
          <ChevronDown size={20} color="#9095a9" className={`transition ${listVisible ? "rotate-180" : ""}`} />
        </label>
        {listVisible && (
          <ul className="mt-2 rounded border bg-white">
            {sort.map(item => (
              <li
                className={`cursor-pointer px-5 py-3 transition hover:bg-gray-100 ${sortType === item ? "bg-gray-100" : ""}`}
                onClick={() => {
                  setSortType(item);
                  setListVisible(false);
                }}
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-400">Categories</h2>
        <ul>
          {categories.map(item => (
            <li
              onClick={() => setCategory(item)}
              key={item}
              className={`cursor-pointer rounded p-3 transition hover:bg-gray-100 ${category === item ? "bg-gray-100" : ""}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListingsFilter;
