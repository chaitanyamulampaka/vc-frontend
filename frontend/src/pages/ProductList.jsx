import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import instance from "../services/axiosInstance";   
function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    instance.get("products/")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ color: "#5a3921", fontFamily: "Playfair Display" }}>
        Handcrafted Treasures from Etikoppaka
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
