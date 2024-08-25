"use client";

import { FC, useState } from "react";
import Filter from "./HomeFilter";

// import Map from "./Map";

const Home: FC = () => {
  const [position, setPosition] = useState<[number, number]>([43.665208, -79.39271]);

  return (
    <section>
      <Filter onLocationSelect={setPosition} />
      {/* <Map position={position} /> */}
    </section>
  );
};

export default Home;
