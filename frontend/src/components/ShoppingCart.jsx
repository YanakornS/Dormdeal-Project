import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import PostService from "../services/postproduct.service";

const ShoppingCart = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await PostService.getAllPostsProduct();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSort("");
    setSelectedCondition("");
  };

  const getFilteredAndSortedProducts = () => {
    let result = [...products];

    // Search
    if (searchQuery) {
      result = result.filter((product) =>
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by condition
    if (selectedCondition) {
      result = result.filter((product) => product.condition === selectedCondition);
    }

    // Sort
    if (selectedSort === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (selectedSort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "az") {
      result.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (selectedSort === "za") {
      result.sort((a, b) => b.productName.localeCompare(a.productName));
    }

    return result;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  return (
    <div className="section-container pt-14">
      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-y-4 mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto">
          {/* (ยังไม่ทำงาน) หมวดหมู่ */}
          <select className="select select-bordered rounded-lg w-full sm:w-36 bg-white">
            <option>หมวดหมู่</option>
            <option>หมวดหมู่ 1</option>
            <option>หมวดหมู่ 2</option>
          </select>

          {/*  จัดเรียงตาม */}
          <select
            className="select select-bordered rounded-lg w-full sm:w-36 bg-white"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="">จัดเรียงตาม</option>
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="price-high">ราคามากไปน้อย</option>
            <option value="price-low">ราคาน้อยไปมาก</option>
            <option value="az">ก-ฮ</option>
            <option value="za">ฮ-ก</option>
          </select>

          {/*  สภาพสินค้า */}
          <select
            className="select select-bordered rounded-lg w-full sm:w-36 bg-white"
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
          >
            <option value="">สภาพสินค้า</option>
            <option value="มือสองสภาพดี">ของมือสองสภาพดี</option>
            <option value="มือสองสภาพพอใช้">ของมือสองสภาพพอใช้</option>
          </select>

          <button
            onClick={handleClearFilters}
            className="btn btn-outline rounded-lg w-full sm:w-auto bg-white"
          >
            ล้างค่า
          </button>
        </div>

        {/* ค้นหา */}
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full sm:w-64 bg-white"
          />
        </div>
      </div>

      {/* รายการสินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-gray-500">ไม่พบสินค้าตามเงื่อนไขที่เลือก</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
