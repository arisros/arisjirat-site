---
title: "📚 Course Management System"
description: "A simple web application for managing course data using PHP and MySQL. Supports **CRUD (Create, Read, Update, Delete)** features with a si..."
category: "study"
tags: ["php", "web", "laravel"]
status: "completed"
draft: false
repo: "https://github.com/arisros/pwtm"
lang: "en"
translationKey: "project-php"
---

A simple web application for managing course data using **PHP** and **MySQL**. Supports **CRUD (Create, Read, Update, Delete)** operations with a responsive interface built on Tailwind CSS.

## Features

- Add course data
- View course list
- Edit course data
- Delete course data
- Simple and responsive UI

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | PHP (Native) |
| Database | MySQL |
| Frontend | HTML + Tailwind CSS |

## Folder Structure

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

> CRUD logic is separated into the `feature/` folder, while reusable view components (header and footer) live in the `template/` folder.

## Code Snippets

### 1. Create — Add Data

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

### 2. Read — Display Data

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

### 3. Update

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

### 4. Delete

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

> All queries use **prepared statements** with `bind_param`, so user input is never concatenated directly into SQL strings.

## Screenshots

- **Database Schema** — <!-- TODO: add screenshots/db.png -->
- **Course List** — <!-- TODO: add screenshots/list.png -->
- **Add / Edit Form** — <!-- TODO: add screenshots/form.png -->
- **Add Success** — <!-- TODO: add screenshots/create_success.png -->
- **Update Success** — <!-- TODO: add screenshots/update_success.png -->
- **Delete Success** — <!-- TODO: add screenshots/delete_success.png -->

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/arisos/pwtm.git
cd pwtm
```

### 2. Import the database

Import the `db.sql` file via phpMyAdmin or the MySQL CLI:

```bash
mysql -u root -p nama_database < db.sql
```

### 3. Run a local server

```bash
php -S localhost:8000
```

### 4. Open in your browser

```
http://localhost:8000
```

## License

This project is free to use for learning and personal development purposes.
