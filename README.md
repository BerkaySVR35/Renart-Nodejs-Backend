Renart-Nodejs-BackendBu depo, Renart e-ticaret uygulamasının arka yüzünü (backend) oluşturan bir Node.js projesidir. Ürün verilerini yönetir ve ön yüze API hizmetleri sunar.İçindekilerÖzelliklerTeknolojilerKurulumAPI Uç NoktalarıKatkıda BulunmaLisansÖzelliklerÜrün Veri Yönetimi: Ürün bilgilerini (ad, fiyat, resim, renkler, popülerlik puanı vb.) depolama ve sunma.API Hizmetleri: Ön yüz uygulamasının ürün verilerine erişmesi için RESTful API uç noktaları sağlar.Netlify Functions Entegrasyonu: Sunucusuz mimari ile ölçeklenebilir ve kolay dağıtılabilir bir yapı sunar.TeknolojilerBu proje aşağıdaki temel teknolojileri kullanılarak geliştirilmiştir:Node.js: Sunucu tarafı uygulamalar için JavaScript çalışma zamanı.Express.js: Node.js için hızlı, açık ve minimalist bir web çerçevesi.Netlify Functions: Sunucusuz fonksiyonları dağıtmak için kullanılır.Axios: HTTP istekleri yapmak için Promise tabanlı HTTP istemcisi (eğer backend içinde başka bir API'ye istek yapılıyorsa).JavaScript (ES6+): Uygulama mantığı için programlama dili.KurulumProjeyi yerel geliştirme ortamınızda kurmak ve çalıştırmak için aşağıdaki adımları izleyin:Depoyu Klonlayın:git clone https://github.com/BerkaySVR35/Renart-Nodejs-Backend.git
Proje Dizinine Gidin:cd Renart-Nodejs-Backend
Bağımlılıkları Yükleyin:npm install
# veya
yarn install
Ortam Değişkenlerini Ayarlayın (Gerekirse):Projeniz herhangi bir API anahtarı, veritabanı bağlantı dizesi vb. gibi hassas bilgiler kullanıyorsa, .env dosyası oluşturmanız ve ilgili değişkenleri tanımlamanız gerekebilir. Örnek:# .env
DATABASE_URL=your_database_connection_string
API_KEY=your_api_key
Uygulamayı Başlatın (Yerel Geliştirme İçin):Eğer projeniz bir Express sunucusu içeriyorsa:npm start
# veya
node server.js # veya ana dosyanızın adı
Eğer sadece Netlify Functions içeriyorsa, Netlify CLI ile yerel olarak test edebilirsiniz:netlify dev
API Uç NoktalarıBu backend uygulaması, ön yüz uygulamasının ürün verilerine erişmesi için aşağıdaki ana API uç noktasını sağlar:GET /.netlify/functions/product: Tüm ürün verilerini döndürür.Metod: GETURL: https://renart-backend.netlify.app/.netlify/functions/product (Dağıtıldıktan sonra)Yanıt Örneği:[
    {
        "_id": "65b9e0b8e7c1f8a7b3e1c2d3",
        "name": "Engagement Ring 1",
        "price": 12895.21,
        "image": "https://example.com/ring1.jpg",
        "colors": ["yellow", "rose", "white"],
        "popularityScore": 4.5
    },
    {
        "_id": "65b9e0b8e7c1f8a7b3e1c2d4",
        "name": "Engagement Ring 2",
        "price": 17042.65,
        "image": "https://example.com/ring2.jpg",
        "colors": ["yellow", "white"],
        "popularityScore": 3.8
    }
    // ... diğer ürünler
]
Katkıda BulunmaKatkılarınız her zaman memnuniyetle karşılanır! Herhangi bir hata bulursanız veya yeni bir özellik önermek isterseniz lütfen bir "issue" açın veya bir "pull request" gönderin.LisansBu proje MIT Lisansı altında lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına bakın.
