import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// import ProductCard from "../../../components/ProductCard";
// import ProductService from "../../../services/product.service";

const ManagePost = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await ProductService.getAllProducts();
  //     if (data) {
  //       setProducts(data);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <div className="section-container pt-16">
      <div className="flex ">
        <div className="profile pt-8 flex ">
          <img
            className="rounded-full "
            src="https://picsum.photos/200/200"
            alt=""
          />
        </div>
        <div className="flex-wrap ">
          {" "}
          <h2>lsakfklsf</h2>
          <h2>lsakfklsf</h2>
          <h2>lsakfklsf</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="cursor-pointer"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePost;
