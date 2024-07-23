// Models
import Color from "../model/color.model.js";

// Utils
import checkValidColor from "../utils/checkValidColor.js";

export const getColors = async (request, response) => {
  const colors = await Color.find();

  response.status(200).send(colors);
};

export const addColor = async (request, response) => {
  const { name, hex } = request.body;

  // Check empty values
  if (!name || !hex) {
    return response
      .status(400)
      .send({ error: "Please fill all required fields" });
  }

  // Check valid color
  const validColor = checkValidColor(hex);

  if (!validColor) {
    return response.status(400).send({ error: "Please enter a valid color" });
  }

  // Existing color name
  const existingColorName = await Color.findOne({ name });

  if (existingColorName) {
    return response
      .status(400)
      .send({ error: "Color name already exists. Please add a new color" });
  }

  // Existing color value
  const existingColorValue = await Color.findOne({ hex });

  if (existingColorValue) {
    return response.status(400).send({
      error: "Color value already exists. Please add a new color value",
    });
  }

  const newColor = await Color.create({ name, hex });

  response.status(201).send(newColor);
};
