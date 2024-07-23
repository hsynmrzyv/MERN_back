// Model
import Product from "../model/product.model.js";
import Size from "../model/size.model.js";
import Color from "../model/color.model.js";

export const getProducts = async (request, response) => {
  try {
    const {
      page = 1,
      limit = 9,
      sort = "newest",
      colors = "",
      sizes = "",
      categories = "",
    } = request.query;

    // Convert query parameters to arrays
    const colorArray = colors ? colors.split(",") : [];
    const sizeArray = sizes ? sizes.split(",") : [];
    const categoryArray = categories ? categories.split(",") : [];

    let sortCriteria;
    switch (sort) {
      case "price-low-high":
        sortCriteria = { price: 1 };
        break;
      case "price-high-low":
        sortCriteria = { price: -1 };
        break;
      case "newest":
      default:
        sortCriteria = { createdAt: -1 };
    }

    // Build filter object
    const filter = {};

    if (colorArray.length > 0) {
      filter["stock.color"] = { $in: colorArray };
    }
    if (sizeArray.length > 0) {
      filter["stock.size"] = { $in: sizeArray };
    }
    if (categoryArray.length > 0) {
      filter.category = { $in: categoryArray };
    }

    const products = await Product.find(filter)
      .sort(sortCriteria)
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(filter);

    response.status(200).send({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error); // Add error logging
    response.status(500).send({ error: "Something went wrong!" });
  }
};

export const getSingleProduct = async (request, response) => {
  const { productId } = request.params;
  const singleProduct = await Product.findById(productId)
    .populate("stock.size")
    .populate("stock.color");

  if (!singleProduct) {
    return response.status(404).send({ error: "Something went wrong!" });
  }

  response.status(200).send(singleProduct);
};

export const addSingleProduct = async (request, response) => {
  const {
    title,
    price,
    category,
    slug,
    sku,
    description,
    size,
    color,
    quantity,
  } = request.body;
  const { path } = request.file;

  // Check empty values
  if (
    !title ||
    !price ||
    !category ||
    !slug ||
    !sku ||
    !description ||
    !path ||
    !size ||
    !color ||
    !quantity
  ) {
    return response
      .status(400)
      .send({ error: "Please fill all required fields" });
  }

  // Check existing specific product
  const existingSpecificProduct = await Product.findOne({ sku })
    .populate("stock.color")
    .populate("stock.size");

  const givenColor = await Color.findOne({ _id: color });
  const givenSize = await Size.findOne({ _id: size });

  if (existingSpecificProduct) {
    const existingSpecificProductInStock = existingSpecificProduct.stock.some(
      (stockItem) => {
        return (
          stockItem.color.name === givenColor.name &&
          stockItem.size.name === givenSize.name
        );
      }
    );

    if (existingSpecificProductInStock) {
      const stockIndex = existingSpecificProduct.stock.findIndex(
        (stockItem) => {
          return (
            stockItem.color.name === givenColor.name &&
            stockItem.size.name === givenSize.name
          );
        }
      );

      existingSpecificProduct.stock[stockIndex].quantity =
        +existingSpecificProduct.stock[stockIndex].quantity + +quantity;

      await existingSpecificProduct.save();
      return response.status(200).send(existingSpecificProduct);
    }

    if (!existingSpecificProductInStock) {
      existingSpecificProduct.stock.push({ quantity, size, color });
      await existingSpecificProduct.save();
      response.status(201).send(existingSpecificProduct);
    }
  }

  // Create a new product
  const stock = [{ quantity, size, color }];
  const newProduct = await Product.create({
    title,
    price,
    category,
    slug,
    sku,
    description,
    stock,
    productPic: path,
  });

  response.status(201).send(newProduct);
};
