// netlify/functions/product.js dosyanız

const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http"); // Netlify Functions için gerekli
const Product = require("../../models/product.model.js"); // <-- Bu yolun doğru olduğundan emin ol!

// Sadece yerel geliştirme ortamında .env dosyasını yüklemek için
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
app.use(express.json());

// MongoDB Bağlantı Ayarları (Vercel için yaptığımız zaman aşımı ayarlarını burada da koruyabiliriz)
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    console.log("Mevcut veritabanı bağlantısı kullanılıyor.");
    return cachedDb;
  }

  try {
    console.log("Yeni veritabanı bağlantısı oluşturuluyor...");
    console.log(
      "MONGODB_URI başlangıcı:",
      process.env.MONGODB_URI
        ? process.env.MONGODB_URI.substring(0, 30) + "..."
        : "URI Tanımsız"
    );

    const client = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // Artık gerekli değil ama zarar vermez
      useUnifiedTopology: true, // Artık gerekli değil ama zarar vermez
      serverSelectionTimeoutMS: 3000, // Sunucu seçimi için 3 saniye bekle
      connectTimeoutMS: 5000, // Başlangıç bağlantısı için 5 saniye bekle
      socketTimeoutMS: 45000, // Socket okuma/yazma için 45 saniye bekle
    });
    cachedDb = client.connections[0].db;
    console.log(
      "MongoDB'ye başarıyla bağlandı. Veritabanı adı:",
      client.connections[0].name
    );
    return cachedDb;
  } catch (error) {
    console.error("MongoDB bağlantısı veya sorgu hatası:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      syscall: error.syscall,
      address: error.address,
      port: error.port,
      reasons: error.reasons
        ? error.reasons.map((r) => ({ name: r.name, message: r.message }))
        : undefined,
    });
    // Hatayı Netlify'a fırlat ki loglarda görebilelim
    throw new Error("MongoDB bağlantısı başarısız oldu: " + error.message);
  }
}

// Netlify fonksiyonları için ana yol (/:splat) zaten fonksiyonun kendisi olur.
// app.get("/", ...) gibi bir route tanımlamak, doğrudan fonksiyona giden (örn: /.netlify/functions/product) istekler içindir.
// Normalde /api/products isteği yönlendirme kuralı ile zaten fonksiyona yönlendirildiği için bu route'a gerek kalmaz.
// Ancak bir deneme amaçlı bırakılabilir.
app.get("/", (req, res) => {
  res.send("Netlify Product API Çalışıyor!");
});

// Ürünleri Listele (endpoint'i "/products" olarak değiştirildi)
app.get("/.netlify/functions/product", async (req, res) => {
  // <-- "/api/products" yerine SADECE "/products"
  try {
    await connectToDatabase();
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error("Ürünleri listelerken hata:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Ürünler getirilirken hata oluştu: " + error.message });
  }
});

// Yeni Ürün Ekle (endpoint'i "/products" olarak değiştirildi)
app.post("/products", async (req, res) => {
  // <-- "/api/products" yerine SADECE "/products"
  try {
    await connectToDatabase();
    const newProduct = req.body;
    const product = await Product.create(newProduct);
    res.status(201).json(product);
  } catch (error) {
    console.error("Ürün oluşturulurken hata:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Ürün oluşturulurken hata oluştu: " + error.message });
  }
});

// Express uygulamanızı Netlify Functions için dışa aktarın
exports.handler = serverless(app);
