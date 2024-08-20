// import { FC } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

// const MapUpdater: FC<{ position: [number, number] }> = ({ position }) => {
//   const map = useMap();

//   if (position) map.setView(position, 13);
//   return null;
// };

// const Map: FC<{ position: [number, number] }> = ({ position }) => {
//   const customIcon = new L.Icon({
//     iconUrl: "/marker.png",
//     iconSize: [20, 32],
//     iconAnchor: [0, 0],
//     popupAnchor: [10, 0],
//   });

//   return (
//     <MapContainer center={position} zoom={12} style={{ height: "100vh", width: "100%" }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <Marker position={position} icon={customIcon} />
//       <MapUpdater position={position} />
//     </MapContainer>
//   );
// };

// export default Map;
