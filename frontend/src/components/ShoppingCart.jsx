import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ProductCard from "./ProductCard";
import PostService from "../services/postproduct.service";
import MainCategoryService from "../services/mainCategory.service";
import { LuPackageSearch } from "react-icons/lu";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ShoppingCart = () => {
  const location = useLocation();
  const initialType = location.state?.type || "wts"; // ใช้ state จาก navigate
  const [selectedType, setSelectedType] = useState(initialType);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 25;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await PostService.getPostsByType(selectedType);
        // บางที res อาจ undefined หรือ object ไม่ใช่ array
        setProducts(Array.isArray(res) ? res : []);
        setCurrentPage(1);
      } catch (e) {
        console.error("Error fetching products:", e);
        setProducts([]); // fallback
      }
    };
    fetchProducts();
  }, [selectedType]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await MainCategoryService.getAllMainCategories();
        setCategories(res.data);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    setSelectedCategory(categoryParam || "");
    setSelectedSubCategory("");
    setSearchQuery("");
    setSelectedSort("");
    setSelectedCondition("");
  }, [location.search]);

  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      setSelectedSubCategory("");
      return;
    }
    const found = categories.find((c) => c._id === selectedCategory);
    setSubCategories(found?.subCategories || []);
    setSelectedSubCategory("");
  }, [selectedCategory, categories]);

  const getFilteredAndSortedProducts = () => {
    let result = Array.isArray(products) ? [...products] : [];


    if (selectedCategory) {
      result = result.filter((p) => p.category?._id === selectedCategory);
    }

    if (selectedSubCategory) {
      result = result.filter((p) =>
        typeof p.subcategory === "string"
          ? p.subcategory === selectedSubCategory
          : p.subcategory?._id === selectedSubCategory
      );
    }

    if (selectedCondition) {
      result = result.filter((p) => p.condition === selectedCondition);
    }

    if (searchQuery) {
      result = result.filter((p) =>
        p.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSort("");
    setSelectedCondition("");
    setSelectedCategory("");
  };

  return (
    <div className="section-container pt-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-y-4 mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto items-start sm:items-center">
          {/* ปุ่ม WTS / WTB */}
          <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-0">
            <button
              onClick={() => setSelectedType("wts")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                selectedType === "wts"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-2 border-blue-700"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm"
              }`}
            >
              ต้องการขาย (WTS)
            </button>
            <button
              onClick={() => setSelectedType("wtb")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                selectedType === "wtb"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg border-2 border-green-700"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm"
              }`}
            >
              ต้องการซื้อ (WTB)
            </button>
          </div>

          {/* เลือกหมวดหมู่ย่อย */}
          <select
            className="select select-bordered rounded-lg w-full sm:w-36 text-sm sm:text-base"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory || subCategories.length === 0}
          >
            <option value="">หมวดหมู่ย่อย</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subCategoryName}
              </option>
            ))}
          </select>

          {/* เลือกการจัดเรียง */}
          <select
            className="select select-bordered rounded-lg w-full sm:w-36 text-sm sm:text-base"
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

          {/* เลือกสภาพสินค้า */}
          <select
            className="select select-bordered rounded-lg w-full sm:w-36 text-sm sm:text-base"
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
          >
            <option value="">สภาพสินค้า</option>
            <option value="มือสองสภาพดี">ของมือสองสภาพดี</option>
            <option value="มือสองสภาพพอใช้">ของมือสองสภาพพอใช้</option>
          </select>

          {/* ปุ่มล้างค่า */}
          <button
            onClick={handleClearFilters}
            className="btn rounded-lg w-full sm:w-auto text-sm sm:text-base"
          >
            ล้างค่า
          </button>
        </div>

        <div className="w-full sm:w-auto rounded-3xl">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full sm:w-64 rounded-3xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 min-h-[40vh] flex flex-col items-center justify-center">
            <LuPackageSearch className="text-gray-700 mb-4" size={64} />
            <h4 className="text-lg font-bold text-gray-600">ไม่พบผลการค้นหา</h4>
            <p>ลองใช้คำอื่นที่แตกต่างหรือคำอื่นที่มีความหมายกว่านี้</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            <IoChevronBack size={20} />
          </button>

          <span className="text-base">
            หน้า {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            <IoChevronForward size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
