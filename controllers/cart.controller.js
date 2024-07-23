// Models
import Cart from "../model/cart.model.js";
import Size from "../model/size.model.js";
import Color from "../model/color.model.js";
import Product from "../model/product.model.js";

export const getCart = async (request, response) => {
  const { _id: userId } = request.user;

  const cart = await Cart.findOne({ userId })
    .populate("cartItems.color")
    .populate("cartItems.size");

  if (!cart) {
    return response.status(400).send({ error: "Something went wrong" });
  }

  response.status(200).send(cart);
};

export const addCart = async (request, response) => {
  const { _id: userId } = request.user;
  const { productId, color, size, quantity, price } = request.body;

  console.log(request.body);

  if (!productId || !color || !size || !quantity || !price) {
    return response
      .status(400)
      .send({ error: "Please fill all required fields" });
  }

  const newCartItem = {
    productId,
    color,
    size,
    quantity,
    price,
  };

  const existingUserCart = await Cart.findOne({ userId })
    ?.populate("cartItems.size")
    .populate("cartItems.color")
    .populate("cartItems.productId");

  const givenColor = await Color.findOne({ _id: color });
  const givenSize = await Size.findOne({ _id: size });
  const givenProduct = await Product.findOne({ _id: productId });

  if (existingUserCart) {
    const existingSpecificCartItem = existingUserCart.cartItems.some(
      (cartItem) => {
        return (
          cartItem.color.name === givenColor.name &&
          cartItem.size.name === givenSize.name &&
          cartItem.productId.sku === givenProduct.sku
        );
      }
    );

    if (existingSpecificCartItem) {
      const cartIndex = existingUserCart.cartItems.findIndex((cartItem) => {
        return (
          cartItem.color.name === givenColor.name &&
          cartItem.size.name === givenSize.name &&
          cartItem.productId.sku === givenProduct.sku
        );
      });

      existingUserCart.cartItems[cartIndex].quantity =
        +existingUserCart.cartItems[cartIndex].quantity + +quantity;

      console.log(quantity, existingUserCart.cartItems[cartIndex].quantity);

      await existingUserCart.save();
      return response.status(200).send(existingUserCart);
    }

    const existingCartItems = existingUserCart.cartItems;
    existingCartItems.push(newCartItem);
    await existingUserCart.save();
    return response.status(202).send(existingUserCart);
  }

  const newCart = await Cart.create({ userId, cartItems: [newCartItem] });

  if (!newCart) {
    return response.status(400).send({ error: "New Cart cannot be created" });
  }

  response.status(201).send(newCart);
};

export const removeCartItem = async (request, response) => {
  const { _id: userId } = request.user;
  const { cartItemId } = request.body;

  // Check cartItemId is exist
  if (!cartItemId) {
    return response.status(400).send({ error: "Cart item ID is required" });
  }

  const userCart = await Cart.findOne({ userId });

  // Check userCart is exist
  if (!userCart) {
    return response.status(404).send({ error: "Cart not found" });
  }

  const itemIndex = userCart.cartItems.findIndex(
    (item) => item._id.toString() === cartItemId
  );

  // Check itemIndex is not -1
  if (itemIndex === -1) {
    return response.status(404).send({ error: "Cart item not found" });
  }

  userCart.cartItems.splice(itemIndex, 1);
  await userCart.save();

  response.status(200).send(userCart);
};
