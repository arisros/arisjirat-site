---
title: "📚 Sistem Manajemen Mata Kuliah"
description: "Aplikasi web sederhana untuk mengelola data mata kuliah menggunakan PHP dan MySQL. Mendukung fitur **CRUD (Create, Read, Update, Delete)** dengan tampilan se..."
category: "study"
tags: ["php", "web", "laravel"]
status: "completed"
draft: false
repo: "https://github.com/arisros/pwtm"
lang: "id"
translationKey: "project-php"
---

Aplikasi web sederhana untuk mengelola data mata kuliah menggunakan **PHP** dan **MySQL**. Mendukung operasi **CRUD (Create, Read, Update, Delete)** dengan antarmuka responsif berbasis Tailwind CSS.

## Fitur

- Menambah data mata kuliah
- Melihat daftar mata kuliah
- Mengubah data mata kuliah
- Menghapus data mata kuliah
- Tampilan sederhana dan responsif

## Teknologi

| Lapisan | Teknologi |
| --- | --- |
| Backend | PHP (Native) |
| Database | MySQL |
| Frontend | HTML + Tailwind CSS |

## Struktur Folder


![Struktur folder proyek CRUD PHP dengan pemisahan logika dan komponen tampilan](/images/inline/project-php-1.svg)

```
📁 config/
└── db.php # Koneksi database
📁 feature/
├── create_matakuliah.php
├── update_matakuliah.php
└── delete_matakuliah.php
📁 template/
├── header.php
└── footer.php
form.php
index.php
```

> Logika CRUD dipisah ke folder `feature/`, sementara komponen tampilan yang dapat digunakan ulang — yakni header dan footer — berada di folder `template/`.

## Snippet Kode


![Alur operasi CRUD antara browser, PHP, dan database MySQL](/images/inline/project-php-2.svg)

### 1. Create — Tambah Data

```php
<?php
include '../config/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $kd = $_POST['kd'];
    $nm = $_POST['nm'];
    $sks = $_POST['sks'];
    $stmt = $conn->prepare("INSERT INTO matakuliah (kd_mtk, nm_mtk, sks) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $kd, $nm, $sks);
    $stmt->execute();
    header("Location: ../index.php?create=success");
}
?>
```

### 2. Read — Tampilkan Data

```php
<?php
$stmt = $conn->prepare("SELECT * FROM matakuliah");
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    echo $row['kd_mtk'] . " - " . $row['nm_mtk'] . " (" . $row['sks'] . " SKS)";
}
?>
```

### 3. Update — Ubah Data

```php
<?php
include '../config/db.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $kd = $_POST['kd'];
    $nm = $_POST['nm'];
    $sks = $_POST['sks'];
    $stmt = $conn->prepare("UPDATE matakuliah SET nm_mtk = ?, sks = ? WHERE kd_mtk = ?");
    $stmt->bind_param("sis", $nm, $sks, $kd);
    $stmt->execute();
    header("Location: ../index.php?update=success");
}
?>
```

### 4. Delete — Hapus Data

```php
<?php
include '../config/db.php';
if (isset($_GET['kd'])) {
    $kd = $_GET['kd'];
    $stmt = $conn->prepare("DELETE FROM matakuliah WHERE kd_mtk = ?");
    $stmt->bind_param("s", $kd);
    $stmt->execute();
    header("Location: ../index.php?delete=success");
}
?>
```

> Setiap query dijalankan dengan **prepared statements** dan `bind_param`, sehingga input pengguna tidak pernah digabungkan langsung ke string SQL.

## Screenshot

- **Struktur Database** — <!-- TODO: add screenshots/db.png -->
- **Daftar Mata Kuliah** — <!-- TODO: add screenshots/list.png -->
- **Form Tambah / Edit** — <!-- TODO: add screenshots/form.png -->
- **Sukses Tambah** — <!-- TODO: add screenshots/create_success.png -->
- **Sukses Update** — <!-- TODO: add screenshots/update_success.png -->
- **Sukses Hapus** — <!-- TODO: add screenshots/delete_success.png -->

## Cara Menjalankan

### 1. Clone repositori

```bash
git clone https://github.com/arisos/pwtm.git
cd pwtm
```

### 2. Impor database

Impor file `db.sql` melalui phpMyAdmin atau MySQL CLI:

```bash
mysql -u root -p nama_database < db.sql
```

### 3. Jalankan server lokal

```bash
php -S localhost:8000
```

### 4. Buka di browser

```
http://localhost:8000
```

## Lisensi

Proyek ini bebas digunakan untuk keperluan pembelajaran dan pengembangan pribadi.
