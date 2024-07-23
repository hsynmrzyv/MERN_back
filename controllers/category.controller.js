import Category from "../model/category.model.js";

// Get categories
export const getCategories = async (request, response) => {
  const categories = await Category.find();

  response.statusCode = 200;
  response.send(categories);
};

// Add category
export const addCategory = async (request, response) => {
  const { name, slug } = request.body;

  // Check empty values
  if (!name || !slug) {
    return response
      .status(400)
      .send({ error: "Please fill all required fields" });
  }

  // Check existing category
  const existingCategoryName = await Category.findOne({ name });

  if (existingCategoryName) {
    return response.status(400).send({
      error: "Category name already exists. Please add a new category name",
    });
  }

  // Check existing slug
  const existingCategorySlug = await Category.findOne({ slug });

  if (existingCategorySlug) {
    return response.status(400).send({
      error: "Category slug already exists. Please add a new category slug",
    });
  }

  // Create new category
  const newCategory = await Category.create({ name, slug });
  response.status(201).send(newCategory);
};
