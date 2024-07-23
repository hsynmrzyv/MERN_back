// Model
import User from "../model/user.model.js";

export const getAllUsers = async (request, response) => {};

export const updateUserAddress = async (request, response) => {
  const { streetAddress, city, country, zipCode, district } = request.body;
  const { _id } = request.user;

  console.log(streetAddress, city, country, zipCode, district);

  // Check empty values
  if (!streetAddress || !city || !country || !zipCode || !district) {
    return response
      .status(404)
      .send({ error: "Please fill all required fields" });
  }

  const existingUser = await User.findOneAndUpdate(
    { _id },
    {
      $set: {
        address: {
          streetAddress,
          city,
          country,
          zipCode,
          district,
        },
      },
    }
  );

  console.log(existingUser);
};

export const updateUserCredentials = async (request, response) => {};
