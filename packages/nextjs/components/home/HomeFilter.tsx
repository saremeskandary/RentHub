import { FC, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { ChevronDown, Search } from "lucide-react";

const sort: string[] = ["Distance", "Rental"];

const Filter: FC<{ onLocationSelect: (i: [number, number]) => void }> = ({ onLocationSelect }) => {
  const sortRef = useRef<HTMLDivElement>(null);
  const [listVisible, setListVisible] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>(sort[0]);

  const [query, setQuery] = useState<string>("");
  const [locations, setLocations] = useState<{ place_name: string; lat: string; lon: string }[]>([]);

  const fetchLocation = async (query: string) => {
    if (query.length > 2) {
      try {
        const { data } = await axios.get(
          `https://photon.komoot.io/api/?q=${query}&limit=5&bbox=-141.001,41.675,-52.648,83.233`,
        );
        setLocations(
          data.features.map(
            (feature: {
              properties: { name: string; city: string; country: string };
              geometry: { coordinates: number[] };
            }) => ({
              place_name: `${feature.properties.name}, ${feature.properties.city ? feature.properties.city + "," : ""} ${feature.properties.country}`,
              lat: feature.geometry.coordinates[1],
              lon: feature.geometry.coordinates[0],
            }),
          ),
        );
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    } else {
      setLocations([]);
    }
  };

  const debouncedFetchLocations = useCallback(debounce(fetchLocation, 300), []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedFetchLocations(e.target.value);
  };

  const handleLocationClick = (location: { place_name: string; lat: string; lon: string }) => {
    onLocationSelect([parseFloat(location.lat), parseFloat(location.lon)]);
    setLocations([]);
    setQuery(location.place_name);
  };

  useEffect(() => {
    const closeSort = (e: MouseEvent) => {
      if (sortRef.current && !e.composedPath().includes(sortRef.current)) setListVisible(false);
    };
    document.body.addEventListener("click", closeSort);
    return () => document.body.removeEventListener("click", closeSort);
  }, []);

  return (
    <div className="absolute top-24 z-[499] flex w-full justify-between gap-5 px-3 md3:flex-col md3:gap-2">
      <div className="w-full max-w-[500px] md3:max-w-none">
        <div className="flex items-center gap-3 rounded border bg-white px-5 py-3">
          <Search size={20} color="#9095a9" className="mb-[2px]" />
          <input
            value={query}
            onChange={handleSearchChange}
            type="text"
            className="block w-full appearance-none bg-white text-sm outline-none"
            placeholder="Search"
          />
        </div>

        {locations.length > 0 && (
          <ul className="mt-1 w-full rounded border bg-white">
            {locations.map((location, index) => (
              <li
                key={index}
                onClick={() => handleLocationClick(location)}
                className="cursor-pointer px-5 py-3 transition hover:bg-gray-100"
              >
                {location.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div ref={sortRef} className="relative w-full max-w-[300px] md3:max-w-none">
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
          <ul className="absolute right-0 mt-1 w-full rounded border bg-white">
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
    </div>
  );
};

export default Filter;
