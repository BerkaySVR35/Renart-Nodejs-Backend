const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product.model.js");

const app = express();
app.use(express.json());

async function getGoldPriceUsd() {
  //GoldApi.io settings.
  let myHeaders = new Headers();
  myHeaders.append("x-access-token", "goldapi-kn2o8vsmctr74g6-io");
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

// --- MongoDB Bağlantısı ---
// Bağlantıyı bir kere yapıp tekrar kullanmak için global bir değişken kullanalım
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    console.log("Mevcut veritabanı bağlantısı kullanılıyor.");
    return cachedDb;
  }

  try {
    console.log("Yeni veritabanı bağlantısı oluşturuluyor...");
    const client = await mongoose.connect(process.env.MONGODB_URI, {
      // Ortam değişkeni kullanıldı
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedDb = client.connections[0].db;
    console.log("MongoDB'ye başarıyla bağlandı.");
    return cachedDb;
  } catch (error) {
    console.error("MongoDB bağlantısı başarısız oldu:", error);
    throw new Error("MongoDB bağlantısı başarısız oldu.");
  }
}

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

  // Input validation (ekstra sağlamlık için)
  if (
    !name ||
    typeof popularityScore !== "number" ||
    typeof weight !== "number" ||
    !Array.isArray(images) ||
    images.length === 0
  ) {
    return res.status(400).json({
      message:
        "Eksik veya geçersiz ürün verisi: name (metin), popularityScore (sayı), weight (sayı) ve images (dizi) gerekli.",
    });
  }

  // --- Ana 'try' bloğu başlıyor ---
  try {
    //Get Price
    let goldPrice;
    try {
      // İçteki 'try' bloğu: Altın fiyatı çekme
      goldPrice = await getGoldPriceUsd();
      console.log("Fetched Gold Price:", goldPrice); // Log the fetched price
      if (typeof goldPrice !== "number") {
        // Ensure goldPrice is a number
        throw new Error("Altın fiyatı geçersiz formatta alındı.");
      }
    } catch (goldError) {
      console.error("Altın fiyatı alınamadı:", goldError);
      return res.status(500).json({
        message:
          goldError.message ||
          "Altın fiyatı alınamadı, lütfen daha sonra tekrar deneyin.",
      });
    }

    await connectToDatabase();

    const calculatedPrice = (popularityScore + 1) * weight * goldPrice;

    const productData = {
      name,
      popularityScore,
      weight,
      images,
      price: calculatedPrice,
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error("Ürün oluşturulurken genel hata:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
