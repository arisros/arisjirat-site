---
title: "ALGO3 - Graph (Adjacency Matrix, C)"
description: "Repository ini disiapkan untuk pola ajar ALGO3 berbasis:"
category: "study"
tags: ["algorithms", "graph", "c-programming"]
status: "completed"
draft: false
image: "/images/banners/project-algo3.png"
---

# ALGO3 - Graph (Adjacency Matrix, C)

Repository ini disiapkan untuk pola ajar ALGO3 berbasis:

- Representasi graph dengan `int M[n][n]`
- Translasi model -> data -> operasi
- Query langsung, query multi-langkah, traversal matrix
- Enumerasi jalur brute force (tanpa DFS/BFS formal)

## Struktur

- `pertemuan1/graph_tak_berarah.c` - graph tak berarah, degree, query dasar
- `pertemuan2/graph_berarah.c` - graph berarah, indegree/outdegree, query dua langkah
- `pertemuan3/cetak_semua_path.c` - cetak semua jalur A -> D tanpa revisiting (brute force, sesuai `tugas3.png`)
- `Makefile` - build dan run cepat

## Build

```bash
make all
```

## Run

```bash
make run-p1
make run-p2
make run-p3
```

## Catatan Akademik

Fokus repo ini adalah fondasi struktur data graph secara imperatif dan procedural.
Belum masuk ke algoritma formal seperti DFS rekursif, BFS, Dijkstra, atau topological sort.
