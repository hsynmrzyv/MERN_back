import mongoose from "mongoose";

const sizeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const sizeModel = mongoose.model("Size", sizeSchema);

export default sizeModel;
