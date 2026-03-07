import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../services/axiosInstance";   

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
  // Fetch product details
  instance.get(`products/${id}/`)
    .then(res => {
      const data = res.data;
      setProduct(data);

      if (data.img) {
        setSelectedImage(data.img);
      }
    })
    .catch(err => console.log(err));

  // Fetch product images
  instance.get(`products/${id}/images/`)
    .then(res => {
      const data = res.data;
      setImages(data);

      if (data.length > 0) {
        setSelectedImage(data[0].image);
      }
    })
    .catch(err => console.log(err));
  // Fetch reviews
instance.get(`reviews/?product=${id}`)
  .then(res => {
    setReviews(res.data);
  })
  .catch(err => console.log(err));

}, [id]);
  if (!product) return <div className="text-center mt-20">Loading...</div>;

  const discountPercentage =
    product.oldprice
      ? Math.round(
          ((product.oldprice - product.cost) / product.oldprice) * 100
        )
      : 0;

  const handleReviewSubmit = async (e) => {
  e.preventDefault();
  setReviewError("");

  const formData = new FormData();
  formData.append("product", id);
  formData.append("rating", reviewRating);
  formData.append("comment", reviewComment);

  reviewImages.forEach((img) => {
    formData.append("images", img);
  });

  try {
    await instance.post("reviews/", formData);

    setReviewRating(5);
    setReviewComment("");
    setReviewImages([]);

    const res = await instance.get(`reviews/?product=${id}`);
    setReviews(res.data);

  } catch (err) {
  const errorData = err.response?.data;

  if (Array.isArray(errorData)) {
    // When backend returns ["message"]
    setReviewError(errorData[0]);
  } else if (errorData?.non_field_errors) {
    setReviewError(errorData.non_field_errors[0]);
  } else {
    setReviewError("Error submitting review.");
  }
}
};
const handleAddToCart = async () => {
  try {
    await instance.post("cart/", {
      product: id,
      quantity: quantity
    });

    alert("Added to cart!");
  } catch (err) {
    alert("Please login first.");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f1] to-[#f2ece4] py-16 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

        {/* ================= IMAGE SECTION ================= */}
        <div>
          {/* Main Image */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {selectedImage && (
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[500px] object-contain transition duration-500 hover:scale-105"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 mt-4 flex-wrap">
            {images.map((imgObj) => (
              <img
                key={imgObj.id}
                src={imgObj.image}
                alt=""
                onClick={() => setSelectedImage(imgObj.image)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                  selectedImage === imgObj.image
                    ? "border-[#d4a373]"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= PRODUCT INFO ================= */}
        <div>
          <h1 className="text-4xl font-bold font-serif text-[#5a3921] mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`text-sm ${
                  i < product.rating
                    ? "fas fa-star text-yellow-400"
                    : "far fa-star text-gray-300"
                }`}
              ></i>
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-semibold text-[#7f5539]">
              ₹{product.cost}
            </span>

            {product.oldprice && (
              <span className="text-gray-400 line-through text-lg">
                ₹{product.oldprice}
              </span>
            )}

            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">
                ✔ In Stock ({product.stock} left)
              </span>
            ) : (
              <span className="text-red-500 font-medium">
                ✖ Out of Stock
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-gray-200 rounded-l-lg"
            >
              -
            </button>

            <span className="px-6 py-2 border-t border-b border-gray-200">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(prev => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded-r-lg"
            >
              +
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-6">
            <button
              onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-gradient-to-r from-[#d4a373] to-[#c08a5a] 
                          text-white px-8 py-3 rounded-full shadow-lg
                          hover:shadow-xl hover:scale-105 transition duration-300"
              >
                Add to Cart

            </button>

            <button
              disabled={product.stock === 0}
              className="bg-gradient-to-r from-[#588157] to-[#476448] 
                         text-white px-8 py-3 rounded-full shadow-lg
                         hover:shadow-xl hover:scale-105 transition duration-300"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {/* ================= REVIEW SECTION ================= */}
<div className="max-w-6xl mx-auto mt-16">

  <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

  {reviews.length === 0 && (
    <p className="text-gray-500">No reviews yet.</p>
  )}

  {reviews.map((review) => (
    <div key={review.id} className="bg-white p-6 rounded-xl shadow mb-6">

      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{review.user}</span>
        <span className="text-yellow-500">⭐ {review.rating}/5</span>
      </div>

      <p className="text-gray-700 mb-3">{review.comment}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {review.images.map((img) => (
            <img
              key={img.id}
              src={img.image}
              alt="review"
              className="w-24 h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  ))}

</div>
<h3 className="text-xl font-semibold mt-10 mb-4">Write a Review</h3>

<form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-xl shadow">

  {/* Rating */}
  <select
    value={reviewRating}
    onChange={(e) => setReviewRating(e.target.value)}
    className="border p-2 mb-4 w-full"
  >
    {[1,2,3,4,5].map(num => (
      <option key={num} value={num}>
        {num} Star{num > 1 && "s"}
      </option>
    ))}
  </select>

  {/* Comment */}
  <textarea
    value={reviewComment}
    onChange={(e) => setReviewComment(e.target.value)}
    placeholder="Write your review..."
    className="border p-2 w-full mb-4"
  />

  {/* Images */}
  <input
    type="file"
    multiple
    onChange={(e) => setReviewImages([...e.target.files])}
    className="mb-4"
  />

  {reviewError && (
    <p className="text-red-500 mb-4">{reviewError}</p>
  )}

  <button
    type="submit"
    className="bg-[#7f5539] text-white px-6 py-2 rounded-lg"
  >
    Submit Review
  </button>

</form>
    </div>
  );
}

export default ProductDetail;
