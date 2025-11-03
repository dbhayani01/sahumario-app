import React, { useEffect, useState } from "react";
import PerfumeCard from "../components/PerfumeCard";
import { api } from "../lib/api";

export default function PerfumesPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api("/products").then(setProducts).catch(console.error);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h3 className="text-2xl md:text-3xl font-semibold">Our Collection</h3>
      <p className="mt-1 text-gray-600">Discover our range of authentic oil-based perfumes.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <PerfumeCard key={p.id} name={p.name} description={p.description} price={p.price} productId={p.id} />
        ))}
      </div>
    </section>
  );
}
