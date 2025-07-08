const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
    },

    popularityScore: {
      type: Number,
      required: [true],
      default: 0,
    },
    weight: {
      type: Number,
      required: [true],
      default: 0,
    },
    images: [
      {
        color: {
          // Renk adını tutacak alan
          type: String,
          required: true,
        },
        url: {
          // Resim URL'sini tutacak alan
          type: String,
          required: true,
        },
      },
    ],
    price: {
      type: Number,
      required: false, // Fiyatı biz hesaplayacağımız için zorunlu olmayabilir
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
