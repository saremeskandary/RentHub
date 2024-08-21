import Listings from "./Listings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Listings`,
};

export default function ListingsPage() {
  return <Listings />;
}
