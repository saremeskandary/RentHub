"use client";

import { FC, useState } from "react";
import Filter from "./HomeFilter";
<<<<<<< HEAD

// import Map from "./Map";
=======
import Map from "./Map";
>>>>>>> 6f9488329e8e3251ccf018e5a46345960fdf9364

const Home: FC = () => {
  const [position, setPosition] = useState<[number, number]>([43.665208, -79.39271]);

  return (
    <section>
      <Filter onLocationSelect={setPosition} />
      <Map position={position} />
    </section>
  );
};

export default Home;
