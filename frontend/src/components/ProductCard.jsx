import { useState, useEffect, useContext } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import WishListService from "../services/wishlist.service";
import { AuthContext } from "../context/AuthContext"; // ถ้าใช้ context user
import toast, { Toaster } from "react-hot-toast";

const ProductCard = ({ product = false }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext); // ต้องมี user ถึงเรียกได้

  // ตรวจสอบว่า post นี้อยู่ใน wishlist หรือไม่
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return; // ต้อง login ก่อน
      try {
        const res = await WishListService.getWishlist();
        const wishlistArray = res.data.wishlist || [];
        const inWishlist = wishlistArray.some(
          (item) => item._id === product._id
        );

        setIsHeartFilled(inWishlist);
      } catch (err) {
        console.error("โหลด wishlist ล้มเหลว", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkWishlist();
  }, [product._id, user]);

  const handleHeartClick = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด");
      return;
    }

    try {
      await WishListService.toggleWishlist(product._id);
      setIsHeartFilled(!isHeartFilled);

      toast.success(
        isHeartFilled
          ? `ลบออกจากรายการโปรดแล้ว`
          : `เพิ่มเข้ารายการโปรดสำเร็จ`,
        {
          icon: isHeartFilled ? "💔" : "❤️",
          style: {
            
            borderRadius: "10px",
            background: isHeartFilled ? "#fef2f2" : "#ecfdf5",
            color: isHeartFilled ? "#b91c1c" : "#065f46",
            border: isHeartFilled ? "1px solid #fecaca" : "1px solid #a7f3d0",
            boxShadow: 'none'
          },
        }
      );
    } catch (err) {
      console.error("ไม่สามารถเพิ่ม/ลบ Wishlist ได้", err);
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    
    <div className="card shadow-lg flex flex-col h-full relative">
      <Toaster position="bottom-center" />
      <a href={`/postproductdetail/${product._id}`} className="block">
        <figure className="relative">
          <img
            src={product.images}
            alt={product.productName}
            className="w-full h-60 object-cover"
          />

          {product.postPaymentType === "Paid" && (
            <div className="absolute top-2 left-2">
              <span className="badge badge-warning gap-2 px-3 py-1 text-xs font-semibold">
                🔥 โฆษณา
              </span>
            </div>
          )}

          {!isLoading && (
            <button
              onClick={handleHeartClick}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow text-red-500"
            >
              {isHeartFilled ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </button>
          )}
        </figure>

        <div className="card-body p-4 flex flex-col grow">
          <h3 className="text-sm font-extralight min-h-[48px] line-clamp-2">
            {product.productName}
          </h3>
          <p className="text-lg font-bold  mt-auto">
            {formatPrice(product.price)}
          </p>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;
