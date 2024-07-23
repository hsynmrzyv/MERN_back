// Models
import Review from "../model/review.model.js";

export const getSpecificReviews = async (request, response) => {
  const { productId } = request.params;

  const specificReviews = await Review.find({ productId });

  if (!specificReviews) {
    return response.status(400).send({ error: "Something went wrong" });
  }

  response.status(200).send(specificReviews);
};

export const getReviews = async (request, response) => {
  const reviews = await Review.find();

  if (!reviews) {
    return response.status(400).send({ error: "Something went wrong" });
  }

  response.status(200).send(reviews);
};

export const addReview = async (request, response) => {
  const { _id: userId } = request.user;
  const { rating, comment, productId } = request.body;

  // Check empty values
  if (!rating || !comment || !productId) {
    return response
      .status(400)
      .send({ error: "Please fill all required fields" });
  }

  const newReview = await Review.create({
    userId,
    productId,
    rating,
    comment,
  });

  if (!newReview) {
    return response.status(201).send({ error: "Review not created" });
  }

  response.status(201).send(newReview);
};
