# BScript - Setup
1. Firebase Console: buat project > Authentication (Email/Password) > Firestore Database.
2. Tempel isi firestore.rules ke tab Rules > Publish.
3. Buat user admin di Authentication, salin UID-nya. Di Firestore buat koleksi `admins`, document ID = UID tsb (isi field bebas, mis. role: "admin").
4. Isi config web app di js/firebase.js.
5. Project settings > Service accounts > Generate private key (JSON).
6. Vercel > Environment Variables:
   - FIREBASE_SERVICE_ACCOUNT = isi JSON tadi (satu baris)
   - KEY_SECRET = string acak panjang (min 32 karakter)
7. Deploy folder ini ke Vercel. Tambahkan 3 domain ke SATU project yang sama: domain utama, verifikasi 1, verifikasi 2.
8. Buka /admin.html, login, isi Pengaturan (link Monetag Direct Link, URL 3 domain, jumlah iklan).
