import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import { useEffect, useState } from "react";
import PostService from "../../services/postproduct.service";

const ProductSection = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <div className="section-container px-6 py-12">
      {/* หัวข้อ */}
      <h2 className="text-2xl font-bold mb-6">สินค้าที่โฆษณา</h2>

      {/* Grid สินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.slice(0, 5).map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: false }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
