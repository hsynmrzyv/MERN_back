// Model
import Size from "../model/size.model.js";

// Utils
import isValidSize from "../utils/checkValidSize.js";

export const getSizes = async (request, response) => {
  const sizes = await Size.find();

  response.status(200).send(sizes);
};

export const addSize = async (request, response) => {
  const { name } = request.body;

  // Check empty values
  if (!name) {
    return response
      .status(400)
      .send({ error: "Please fill all required fields." });
  }

  // Check valid size
  const isValid = isValidSize(name);

  if (!isValid) {
    return response.status(400).send({ error: "Please add a valid size" });
  }

  // Check existing size
  const existingSize = await Size.findOne({ name });

  if (existingSize) {
    return response.status(400).send({ error: "Size already exists" });
  }

  const newSize = await Size.create({ name });
  response.status(201).send(newSize);
};
