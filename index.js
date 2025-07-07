const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const app = express();
app.use(express.json());

async function getGoldPriceUsd() {
  //GoldApi.io settings.
  let myHeaders = new Headers();
  myHeaders.append("x-access-token", "goldapi-kn2o8vsmct44ocy-io");
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const apiUrl = `https://www.goldapi.io/api/XAU/USD/`;

    const res = await fetch(apiUrl, requestOptions);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Hatası: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    //console.log("Altın Fiyatı Verisi:", data.price);

    if (data && typeof data.price === "number") {
      return data.price;
    }
  } catch (error) {
    console.log("Altın fiyatı alınırken hata oluştu:", error.message);
    throw new Error("Altın fiyatı alınamadı.");
  }
}

console.log(getGoldPriceUsd());

// GET request
app.get("/", (req, res) => {
  res.send(
    "Hello from node API server please configure url to add /api/products to endpoint"
  );
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// New Product POST endpoint
app.post("/api/products", async (req, res) => {
  //console.log("Gelen istek gövdesi:", req.body);

  // destructuring from req.body
  const { name, popularityScore, weight, images } = req.body;

  try {
    //Get Price
    let goldPrice;
    try {
      goldPrice = await getGoldPriceUsd();
      console.log(goldPrice);
    } catch (goldError) {
      return res.status(500).json({
        message:
          goldError.message ||
          "Altın fiyatı alınamadı, lütfen daha sonra tekrar deneyin.",
      });
    }
    // Calculate Price
    // Price = (popularityScore + 1) * weight * goldPrice
    const calculatedPrice = (popularityScore + 1) * weight * goldPrice;

    //console.log("Hesaplaanan fiyat", calculatedPrice);

    // add Price field to moongose field.
    const productData = {
      name,
      popularityScore,
      weight,
      images,
      price: calculatedPrice,
    };

    const product = await Product.create(productData);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://svrberkay:admin@backend.n06d9i1.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Backend"
  )
  .then(() => {
    console.log("MongoDB'ye başarıyla bağlandı.");
    app.listen(3000, () => {
      console.log(
        "Sunucu 3000 numaralı portta çalışıyor: http://localhost:3000"
      );
    });
  })
  .catch((err) => {
    console.log("MongoDB bağlantısı başarısız oldu:", err);
  });
