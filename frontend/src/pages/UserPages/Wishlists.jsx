import React, { useEffect, useState, useContext } from "react";
import WishListService from "../../services/wishlist.service";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

import { LuPackageSearch } from "react-icons/lu";

const Wishlists = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const { user } = useContext(AuthContext);

  // ดึงข้อมูล wishlist
  const fetchWishlist = async () => {
    try {
      const response = await WishListService.getWishlist();
      setWishlistProducts(response.data.wishlist || []);
    } catch (error) {
      console.error("ดึง wishlist ไม่ได้:", error);
      toast.error("โหลดข้อมูลล้มเหลว ลองใหม่อีกครั้ง");
    }
  };

  // โหลดเมื่อ user เปลี่ยนหรือล็อกอิน
  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  // ลบสินค้าจาก wishlist
  const handleHeartClick = async (product) => {
    try {
      await WishListService.toggleWishlist(product._id);
      setWishlistProducts((prev) =>
        prev.filter((item) => item && item._id !== product._id)
      );
      toast.success(` ลบ "${product.productName}" ออกจากรายการโปรดแล้ว`, {
      duration: 3000,
      icon:  "💔",
      style: {
        borderRadius: "10px",
        background: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
      },
      });
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    }
  };

  // แปลงราคาเป็นสกุลเงินไทย
  const formatPrice = (price) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="section-container pt-22">
      <Toaster position="buttom-center" />

      <h2 className="text-2xl font-bold mb-4">รายการที่คุณถูกใจ</h2>

      {wishlistProducts.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 min-h-[45vh] flex flex-col items-center justify-center">
          <LuPackageSearch className="text-base-700 mb-2" size={64} />
          <h4 className="text-lg font-bold text-base-800">
            ยังไม่มีสินค้าอยู่ในรายการที่คุณชอบ
          </h4>
          <a href="/shoppingpost" className="btn-choices mt-4 font-bold">
            ไปยังโพสต์สินค้า
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlistProducts
            .filter((product) => product && product._id)
            .map((product) => (
              <div
                key={product._id}
                className="card shadow-lg flex flex-col h-full relative"
              >
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

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleHeartClick(product);
                      }}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow text-red-500 z-10"
                    >
                      <FaHeart size={20} />
                    </button>
                  </figure>

                  <div className="card-body p-4 flex flex-col grow">
                    <h3 className="text-sm font-extralight min-h-[48px] line-clamp-2">
                      {product.productName}
                    </h3>
                    <p className="text-lg font-bold mt-auto">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </a>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Wishlists;
