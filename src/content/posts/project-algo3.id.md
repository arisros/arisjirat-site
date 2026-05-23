---
title: "ALGO3 - Graph (Adjacency Matrix, C)"
description: "Repository ini disiapkan untuk pola ajar ALGO3 berbasis:"
category: "study"
tags: ["algorithms", "graph", "c-programming"]
status: "completed"
draft: false
image: "/images/banners/project-algo3.png"
lang: "id"
translationKey: "project-algo3"
---

## Ringkasan

Repository ini disiapkan untuk pola ajar **ALGO3** berbasis representasi graph imperatif dalam C. Pendekatan yang dipakai sengaja sederhana agar fondasi struktur data dan translasi model terlihat eksplisit.

Cakupan materi:

- Representasi graph dengan `int M[n][n]`
- Translasi **model → data → operasi**
- Query langsung, query multi-langkah, dan traversal matrix
- Enumerasi jalur secara *brute force* (tanpa DFS/BFS formal)

## Struktur Direktori

| Berkas | Topik |
| --- | --- |
| `pertemuan1/graph_tak_berarah.c` | Graph tak berarah: degree dan query dasar |
| `pertemuan2/graph_berarah.c` | Graph berarah: indegree/outdegree, query dua langkah |
| `pertemuan3/cetak_semua_path.c` | Cetak semua jalur A → D tanpa revisiting (brute force, sesuai `tugas3.png`) |
| `Makefile` | Build dan run cepat |

## Penggunaan

### Build

```bash
make all
```

### Run

```bash
make run-p1
make run-p2
make run-p3
```

## Catatan Akademik

> Fokus repo ini adalah fondasi struktur data graph secara imperatif dan prosedural.

Materi **belum** mencakup algoritma formal seperti:

- DFS rekursif
- BFS
- Dijkstra
- Topological sort
