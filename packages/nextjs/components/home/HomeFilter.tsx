import axios from 'axios'
import debounce from 'lodash.debounce'
import { ChevronDown, Search } from 'lucide-react'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

import styles from './Home.module.scss'

const sort: string[] = ['Distance', 'Rental']

const Filter: FC<{ onLocationSelect: (i: [number, number]) => void }> = ({ onLocationSelect }) => {
  const sortRef = useRef<HTMLDivElement>(null)
  const [listVisible, setListVisible] = useState<boolean>(false)
  const [sortType, setSortType] = useState<string>(sort[0])

  const [query, setQuery] = useState<string>('')
  const [locations, setLocations] = useState<{ place_name: string; lat: string; lon: string }[]>([])

  const fetchLocation = async (query: string) => {
    if (query.length > 2) {
      try {
        const { data } = await axios.get(
          `https://photon.komoot.io/api/?q=${query}&limit=5&bbox=-141.001,41.675,-52.648,83.233`
        )
        setLocations(
          data.features.map(
            (feature: {
              properties: { name: string; city: string; country: string }
              geometry: { coordinates: number[] }
            }) => ({
              place_name: `${feature.properties.name}, ${feature.properties.city ? feature.properties.city + ',' : ''} ${feature.properties.country}`,
              lat: feature.geometry.coordinates[1],
              lon: feature.geometry.coordinates[0]
            })
          )
        )
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    } else {
      setLocations([])
    }
  }

  const debouncedFetchLocations = useCallback(debounce(fetchLocation, 300), [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    debouncedFetchLocations(e.target.value)
  }

  const handleLocationClick = (location: { place_name: string; lat: string; lon: string }) => {
    onLocationSelect([parseFloat(location.lat), parseFloat(location.lon)])
    setLocations([])
    setQuery(location.place_name)
  }

  useEffect(() => {
    const closeSort = (e: MouseEvent) => {
      if (sortRef.current && !e.composedPath().includes(sortRef.current)) setListVisible(false)
    }
    document.body.addEventListener('click', closeSort)
    return () => document.body.removeEventListener('click', closeSort)
  }, [])

  return (
    <div className={styles.filter}>
      <div className={styles.filter__search}>
        <div className={styles.filter__input}>
          <Search size={20} color="#9095a9" />
          <input
            value={query}
            onChange={handleSearchChange}
            type="text"
            className="input"
            placeholder="Search"
          />
        </div>

        {locations.length > 0 && (
          <ul>
            {locations.map((location, index) => (
              <li key={index} onClick={() => handleLocationClick(location)}>
                {location.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div ref={sortRef} className={styles.filter__sort}>
        <label onClick={() => setListVisible(!listVisible)}>
          <div>
            <span>Sort by: </span>
            <span>{sortType}</span>
          </div>
          <ChevronDown
            size={20}
            color="#9095a9"
            className={listVisible ? `${styles.active}` : ''}
          />
        </label>
        {listVisible && (
          <ul>
            {sort.map((item) => (
              <li
                className={sortType === item ? `${styles.active}` : ''}
                onClick={() => {
                  setSortType(item)
                  setListVisible(false)
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
  )
}

export default Filter
