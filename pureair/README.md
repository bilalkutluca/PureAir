PureAir: Hava Kirliliği İzleme Platformu
Projenin Amacı ve Kapsamı
PureAir, dünya genelinde hava kirliliği verilerini toplayan, analiz eden ve görselleştiren bir web tabanlı platformdur. Kullanıcılar, gerçek zamanlı hava kalitesi verilerini harita ve grafiklerle görüntüleyebilir, anormal kirlilik seviyeleri için uyarılar alabilir ve belirli bölgeler için detaylı analiz yapabilir.
Sistem Mimarisi ve Komponentler

Backend: Monolitik mimari, Spring Boot ile geliştirildi. TimescaleDB, zaman serisi verilerini saklar. Apache Kafka, veri akışı ve anomali bildirimleri için kullanılır.
Frontend: React ve Vite ile geliştirildi. Leaflet ısı haritası, Recharts grafikler ve anomali panelleri içerir.
Veritabanı: TimescaleDB, hava kalitesi verilerini hipertablo olarak saklar.
Kuyruklama: Kafka, ham veri işleme ve anomali bildirimleri için kullanılır.
Dağıtım: Docker Compose ile tüm servisler (backend, frontend, TimescaleDB, Kafka, Zookeeper) tek komutla çalışır.

Teknoloji Seçimleri ve Gerekçeleri

Spring Boot: Hızlı geliştirme, güçlü ekosistem ve REST API desteği.
TimescaleDB: Zaman serisi verileri için optimize edilmiş, PostgreSQL tabanlı.
Kafka: Yüksek hacimli veri akışı ve asenkron iletişim için uygun.
React: Esnek, bileşen tabanlı UI geliştirme ve geniş kütüphane desteği.
Leaflet: Hafif ve özelleştirilebilir harita çözümü.
Recharts: Kolay kullanımlı, responsive grafik kütüphanesi.

Kurulum Adımları

Gereksinimler:

Docker ve Docker Compose
Node.js (frontend geliştirme için, opsiyonel)
Java 17 ve Maven (backend geliştirme için, opsiyonel)


Kodu Klonlayın:
git clone <repository_url>
cd pureair


Ortam Değişkenlerini Ayarlayın:

Frontend için .env dosyasına OpenWeatherMap API anahtarını ekleyin:VITE_WEATHER_API=your_openweathermap_api_key




Docker ile Çalıştırın:
docker-compose up -d


Backend: http://localhost:8081
Frontend: http://localhost:5173
TimescaleDB: localhost:5432
Kafka: localhost:9092


Test Verisi Ekleyin:
./auto-test.sh --duration=60 --rate=1 --anomaly-chance=10



Kullanım Rehberi

Ana Sayfa: Hava durumu, sosyal medya bağlantıları ve navigasyon ikonları.
Harita: Hava kirliliği ısı haritası, anomali işaretlemeleriyle. Tıklayarak detaylı analiz sayfasına geçin.
Grafik: Hava kalitesi parametrelerinin (PM2.5, PM10, NO2, SO2, O3) zaman grafiği.
Detaylı Analiz: Seçilen bölgenin verileri ve anomalileri.
Bildirimler: Anlık anomali bildirimleri (WebSocket ile).

API Dokümantasyonu
GET /api/air-quality/data

Açıklama: Son 24 saatin hava kalitesi verilerini döndürür.
Yanıt:[
{
"time": "2025-04-28T12:00:00Z",
"latitude": 41.0082,
"longitude": 28.9784,
"pm25": 30.5,
"pm10": 45.2,
"no2": 20.1,
"so2": 10.3,
"o3": 60.4,
"anomaly": true
}
]



GET /api/air-quality/region

Açıklama: Belirli bir bölgenin (enlem, boylam, yarıçap) verilerini döndürür.
Parametreler:
latitude: Enlem
longitude: Boylam
radius: Yarıçap (km)


Yanıt: Yukarıdaki formatta veri listesi.

POST /api/air-quality

Açıklama: Yeni hava kalitesi verisi kaydeder.
İstek Gövdesi:{
"time": "2025-04-28T12:00:00Z",
"latitude": 41.0082,
"longitude": 28.9784,
"pm25": 30.5 "¿
}



WebSocket /ws/notifications

Açıklama: Anomali bildirimlerini anlık olarak alır.
Mesaj Formatı: String (ör. "Kadıköy'de yüksek PM2.5 tespit edildi").

Script Kullanımı
manual-input.sh

Açıklama: Manuel veri girişi.
Kullanım:./manual-input.sh 41.0082 28.9784 pm25 30.5



auto-test.sh

Açıklama: Otomatik test verisi üretir.
Kullanım:./auto-test.sh --duration=60 --rate=1 --anomaly-chance=10



Sorun Giderme

Backend çalışmıyor:
docker logs backend ile logları kontrol edin.
curl http://localhost:8081/actuator/health ile sağlık durumunu kontrol edin.


Veri görünmüyor:
TimescaleDB'de veri olup olmadığını kontrol edin:docker exec -it timescale psql -U postgres -d pureair -c "SELECT * FROM air_quality LIMIT 5;"


auto-test.sh ile veri ekleyin.


CORS hatası:
Tarayıcı konsolunda hata mesajlarını kontrol edin.
application.properties dosyasındaki CORS ayarlarını doğrulayın.


Kafka bağlantı hatası:
docker logs kafka ile logları kontrol edin.
Topic'leri listeleyin:docker exec -it kafka kafka-topics.sh --list --bootstrap-server kafka:9092





Ek Özellikler

Tahminleme: İsteğe bağlı olarak, son 24 saatlik verilere dayalı basit bir lineer regresyon modeli eklenebilir.
Birim Testler: Backend için JUnit, frontend için Jest testleri yazılabilir.

