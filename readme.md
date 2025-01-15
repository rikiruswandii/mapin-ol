# mapin-ol: OpenLayers + Vite

Proyek **mapin-ol** adalah proyek pembelajaran penggunaan OpenLayers dengan Vite. Proyek ini mencakup berbagai fitur kontrol peta untuk memperluas pemahaman tentang library OpenLayers dalam pengembangan peta interaktif.

## Persyaratan
- Node.js 14 atau lebih baru

## Memulai Proyek
Untuk memulai proyek ini, jalankan perintah berikut:

```bash
npx create-ol-app mapin-ol --template vite
```

Kemudian masuk ke dalam direktori `mapin-ol` dan mulai server pengembangan (tersedia di http://localhost:5173):

```bash
cd mapin-ol
npm start
```

## Build untuk Produksi
Untuk menghasilkan build yang siap digunakan dalam produksi:

```bash
npm run build
```

Kemudian deploy isi dari direktori `dist` ke server Anda. Anda juga dapat menggunakan:

```bash
npm run serve
```

untuk menampilkan hasil build secara lokal sebagai pratinjau.

## Fitur
Proyek ini mendukung berbagai fitur peta interaktif menggunakan OpenLayers:

- **Control Zoom**: Kontrol untuk memperbesar dan memperkecil peta.
- **Drag Control Zoom**: Zoom dengan metode drag pada peta.
- **Control Draw**:
  - Marker (Titik)
  - Polyline (Garis)
  - Polygon (Poligon)
  - Circle (Lingkaran)
- **Control Scale**: Menampilkan skala peta.
- **Control Full Screen**: Mode layar penuh untuk peta.
- **Drag and Drop Feature Support**:
  - GeoJSON
  - TopoJSON
  - GPX
  - KML
  - KMZ
  - IGC

## Lisensi
Proyek ini dikembangkan untuk keperluan pembelajaran dan bersifat terbuka untuk dikembangkan lebih lanjut.

