---
title: "Deteksi Lantai Keramik Kotor"
description: "Proyek ini bertujuan untuk membedakan kondisi lantai keramik **bersih** dan **kotor** menggunakan teknik pengolahan citra digital."
category: "research"
tags: ["image-processing", "computer-vision", "python"]
status: "completed"
draft: false
repo: "https://github.com/arisros/pcd"
lang: "id"
translationKey: "project-pcd"
---

Proyek ini bertujuan membedakan kondisi lantai keramik **bersih** dan **kotor** menggunakan teknik pengolahan citra digital. Pendekatan yang dipakai berbasis analisis intensitas piksel dan variasi tekstur, tanpa melibatkan pembelajaran mesin.

## Kebutuhan

| Komponen | Versi |
|----------|-------|
| Python | 3.8 atau lebih baru |
| OpenCV | terbaru |
| NumPy | terbaru |
| Matplotlib | terbaru |

> Seluruh dependensi dapat dipasang melalui `requirements.txt`.

## Struktur Proyek

```
.
├── deteksi_lantai_kotor.py
├── requirements.txt
├── lantai.jpg
└── docs/
    └── sequence-diagram.png
```

## Alur Sistem


![Diagram alur lima tahap deteksi lantai keramik kotor](/images/inline/project-pcd-1.svg)

<!-- TODO: add sequence_diagram.png -->

Secara ringkas, sistem bekerja melalui lima tahap:

1. Membaca citra lantai keramik.
2. Mengonversi citra ke grayscale dan mereduksi noise.
3. Mengekstraksi fitur statistik berupa **mean** dan **standar deviasi**.
4. Membandingkan nilai standar deviasi terhadap *threshold*.
5. Menentukan kondisi lantai: **bersih** atau **kotor**.

### Dasar Pengambilan Keputusan


![Ilustrasi perbandingan standar deviasi piksel lantai bersih vs kotor](/images/inline/project-pcd-2.svg)

Keputusan klasifikasi bertumpu pada nilai standar deviasi intensitas piksel:

$$\sigma = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(x_i - \mu)^2}$$

Semakin tinggi $\sigma$, semakin besar variasi tekstur pada permukaan — yang umumnya mengindikasikan adanya kotoran atau noda.

## Cara Menjalankan

```bash
pip install -r requirements.txt
python deteksi_lantai_kotor.py
```

> Pastikan file gambar (`lantai.jpg`) berada pada path yang sesuai dengan yang ditentukan di dalam kode.

## Output

Program menghasilkan dua jenis keluaran:

- **Visual:** citra asli, hasil *preprocessing*, dan hasil deteksi.
- **Terminal:** nilai mean, standar deviasi, dan keputusan akhir sistem.

## Catatan

- Sistem bekerja optimal pada kondisi pencahayaan yang relatif stabil.
- Nilai *threshold* dapat disesuaikan berdasarkan hasil pengujian pada lingkungan yang berbeda.
