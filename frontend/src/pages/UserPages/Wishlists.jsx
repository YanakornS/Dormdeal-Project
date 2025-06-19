import React, { useEffect, useState, useContext } from "react";
import WishListService from "../../services/wishlist.service";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Wishlists = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]); //ใช้ useState เพื่อเก็บรายการสินค้าที่ถูกใจไว้ใน state เป็นอาเรย์ของสินค้าแต่ละชิ้น เช่น
  const { user } = useContext(AuthContext);

  const fetchWishlist = async () => {
    try {
      const response = await WishListService.getWishlist(); //เรียก API getWishlist() จาก backend เพื่อดึงรายการสินค้า
      setWishlistProducts(response.data.wishlist || []); //ถ้าดึงสำเร็จ เอามาเก็บใน wishlistProducts ด้วย setWishlistProducts
    } catch (error) {
      console.error("ดึง wishlist ไม่ได้:", error);
    }
  };

  useEffect(() => {
    if (user) fetchWishlist(); //เมื่อ user เปลี่ยน (หรือเพิ่งล็อกอิน), ก็โหลดข้อมูลใหม่ – ถูกต้อง
  }, [user]); //เรียก fetchWishlist() เพื่อโหลดข้อมูลสินค้าที่กดถูกใจจาก server

  //ฟังก์ชัน handleHeartClick ใช้สำหรับลบสินค้าจากรายการโปรดเมื่อกดปุ่มหัวใจ
  
  const handleHeartClick = async (postId) => {
    try {
      await WishListService.toggleWishlist(postId); //เรียก API toggleWishlist() เพื่อเพิ่มหรือลบสินค้าจากรายการโปรด
      //หลังจากลบสำเร็จ, อัพเดต state wishlistProducts เพื่อลบสินค้าที่ถูกลบออกจากรายการโปรด
      setWishlistProducts((prev) =>
        prev.filter((item) => item && item._id !== postId)
      );

    } catch (err) {
      console.error(err);
    }
  };

  //ฟังก์ชัน formatPrice ใช้สำหรับแปลงราคาสินค้าให้เป็นรูปแบบสกุลเงินไทย (THB)
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
      <h2 className="text-2xl font-bold mb-4">รายการที่คุณถูกใจ</h2>

      
      {wishlistProducts.length === 0 ? ( //ถ้า wishlistProducts เป็นอาเรย์ว่าง ให้แสดงข้อความว่า "ยังไม่มีสินค้าในรายการโปรด"
        <p className="text-gray-500">ยังไม่มีสินค้าในรายการโปรด</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlistProducts
            .filter((product) => product && product._id) //กรองเฉพาะสินค้าที่มี _id เพื่อหลีกเลี่ยงข้อผิดพลาด
            .map((product) => ( //วนลูปแสดงสินค้าที่ถูกใจแต่ละชิ้น
              //สำหรับแต่ละ product ใน wishlistProducts, สร้าง card แสดงรายละเอียดสินค้า
              <div key={product._id} className="card shadow-lg flex flex-col h-full relative">
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
                        handleHeartClick(product._id);
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
                    <p className="text-lg font-bold  mt-auto">
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
