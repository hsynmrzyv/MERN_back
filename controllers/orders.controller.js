// Models
import Order from "../model/order.model.js";
import Cart from "../model/cart.model.js";
import Product from "../model/product.model.js";
import Size from "../model/size.model.js";
import Color from "../model/color.model.js";

export const getSingleOrder = async (request, response) => {
  const { userId } = request.params;

  const order = await Order.findOne({ userId });

  if (!order) {
    return response.status(404).send({ error: "Something went wrong" });
  }

  response.status(200).send(order);
};

export const getOrders = async (request, response) => {
  const orders = await Order.find();

  if (!orders) {
    return response.status(404).send({ error: "Something went wrong" });
  }

  response.status(200).send(orders);
};

export const addOrder = async (request, response) => {
  const { totalPrice, orderItems, shippingAddress } = request.body;
  const { _id: userId } = request.user;

  // Check empty values
  for (const value of Object.values(shippingAddress)) {
    if (!value) {
      return response
        .status(404)
        .send({ error: "Please fill all required fields" });
    }
  }

  const orderItemsWithAddress = orderItems.map((orderItem) => {
    return { ...orderItem, shippingAddress };
  });

  const newOrder = await Order.create({
    totalPrice,
    userId,
    orderItems: orderItemsWithAddress,
  });

  if (!newOrder) {
    return response.status(400).send({ error: "Couldn't create a new order" });
  }

  const userCart = await Cart.findOne({ userId });

  if (!userCart) {
    return response.status(400).send({ error: "Something went wrong" });
  }

  userCart.cartItems = [];
  await userCart.save();

  const products = await Product.find();

  for (const orderItem of orderItems) {
    const { color: colorId, size: sizeId, productId, quantity } = orderItem;

    const product = products.find(
      (product) => product._id.toString() === productId.toString()
    );

    if (product) {
      const stockItem = product.stock.find(
        (stockItem) =>
          stockItem.color.toString() === colorId.toString() &&
          stockItem.size.toString() === sizeId.toString()
      );

      if (stockItem) {
        if (quantity > stockItem.quantity) {
          return response.status(400).send({ error: "Invalid quantity" });
        }

        stockItem.quantity -= quantity;
      }

      // Save the updated product
      await product.save();
    }
  }

  response.status(201).send(newOrder);
};
