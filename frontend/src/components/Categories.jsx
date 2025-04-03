import { useEffect, useState } from "react";
import CategorieService from "../services/categorie.service";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await CategorieService.getAllCategorie();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);
  
  return (
    <div className="section-container mt-22">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="categories-card">
            {category.name}
            <img
              className="w-16 h-16 object-cover rounded-md"
              src={category.image}
              alt={category.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
