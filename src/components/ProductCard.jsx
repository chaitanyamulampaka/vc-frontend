import { Link } from "react-router-dom";
import { useState } from "react";

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false);

  const discountPercentage =
    product.oldprice && product.cost
      ? Math.round(
          ((product.oldprice - product.cost) / product.oldprice) * 100
        )
      : 0;

  return (
    <div className="product-card rounded-lg relative overflow-hidden">

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute top-3 right-3 bg-[#802233] text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Image Section */}
      <div className="product-image h-64 w-full flex items-center justify-center">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover p-2"
          />
          <div className="view-more-overlay">
            <span className="text-sm uppercase tracking-wider">
              Quick View
            </span>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 relative pb-6">

        {/* Title + Wishlist */}
        <div className="flex justify-between items-center">
          <h3 className="product-title text-xl font-bold mb-1">
            {product.name}
          </h3>

          <button
            onClick={() => setLiked(!liked)}
            className="bg-transparent border-none p-1 text-xl focus:outline-none transition duration-300"
          >
            <i
              className={`fas fa-heart ${
                liked ? "text-red-500" : "text-[#d4a373]"
              }`}
            ></i>
          </button>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-3 mt-3">
          <span
            className="text-xl font-bold"
            style={{ color: "#8a5a44" }}
          >
            ₹{product.cost}
          </span>

          {product.oldprice && (
            <span className="text-gray-400 line-through text-sm">
              ₹{product.oldprice}
            </span>
          )}
        </div>

        {/* Smaller Rating Stars */}
        <div className="flex items-center mt-1 gap-1">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`${
                i < product.rating
                  ? "fas fa-star text-yellow-400"
                  : "far fa-star text-gray-300"
              } text-sm`}
            ></i>
          ))}
        </div>

        {/* Stock Indicator */}
        <div className="mt-2 text-sm">
          {product.stock > 0 ? (
            <span className="text-green-600">
              In Stock
            </span>
          ) : (
            <span className="text-red-500">
              Out of Stock
            </span>
          )}
        </div>

        {/* Add To Cart */}
        <button
          className="btn-addtocart w-full mt-4 text-white py-2 px-4 rounded 
                     hover:shadow-lg transition duration-300"
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>

        <div className="card-border-pattern"></div>
      </div>
    </div>
  );
}

export default ProductCard;
