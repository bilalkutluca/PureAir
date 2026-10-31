# PureAir frontend

PureAir'in React arayüzü. Projenin tamamı, kurulum ve API için ana dizindeki [README](../README.md) dosyasına bakın.

## Sayfalar

- `/` ana sayfa: bulunduğunuz yerin hava durumu ve saat
- `/map` dünya haritası: ısı katmanı, şehir noktaları, şehir arama
- `/graph` tüm şehirlerin saatlik ortalaması (son 3 gün)
- `/detayli-analiz` seçilen şehrin grafiği ve anomalileri; haritada bir noktaya tıklayıp "Detailed analysis" ile açılır
- `/notifications` WebSocket'ten gelen canlı anomali bildirimleri

## Docker olmadan çalıştırmak

Backend'in `localhost:8081`'de çalışıyor olması gerekir.

```bash
cp .env.example .env   # VITE_WEATHER_API değerini girin
npm install
npm run dev
```

Uygulama http://localhost:5173 adresinde açılır.
