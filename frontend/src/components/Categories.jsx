import { useEffect, useState } from "react";
import CategorieService from "../services/categorie.service";
import { useNavigate } from "react-router";
import MainCategorieService from"../services/mainCategory.service";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await MainCategorieService.getAllMainCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  const handleClickCategory = (categoryId) => {
    navigate(`/shoppingpost?category=${categoryId}`, );
  };

  return (
    <div className="section-container pt-22">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="categories-card cursor-pointer"
            onClick={() => handleClickCategory(category._id)}
          >
            <img
              className="w-16 h-16 object-cover rounded-md"
              src={category.image}
              alt={category.name}
            />
            <p className="text-sm text-center">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;