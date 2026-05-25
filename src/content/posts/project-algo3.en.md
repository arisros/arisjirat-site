---
title: "ALGO3 - Graph (Adjacency Matrix, C)"
description: "This repository is prepared for the ALGO3 teaching pattern based on:"
category: "study"
lang: "en"
translationKey: "project-algo3"
image: "/images/banners/project-algo3.png"
status: "completed"
draft: false
tags: ["algorithms", "graph", "c-programming"]
---

## Summary


![Adjacency matrix representasi graph berarah 4 simpul](/images/inline/project-algo3-1.svg)

This repository is prepared for the **ALGO3** teaching pattern based on imperative graph representation in C. The approach used is deliberately simple so that the foundations of data structures and model translation are explicit.

Scope of material:

- Graph representation with `int M[n][n]`
- Translation of **model → data → operations**
- Direct queries, multi-step queries, and matrix traversal
- Path enumeration via *brute force* (without formal DFS/BFS)

## Directory Structure


![Alur translasi: model graph menjadi matriks lalu operasi query](/images/inline/project-algo3-2.svg)

| File | Topic |
| --- | --- |
| `pertemuan1/graph_tak_berarah.c` | Undirected graph: degree and basic queries |
| `pertemuan2/graph_berarah.c` | Directed graph: indegree/outdegree, two-step queries |
| `pertemuan3/cetak_semua_path.c` | Print all paths A → D without revisiting (brute force, per `tugas3.png`) |
| `Makefile` | Quick build and run |

## Usage

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

## Academic Notes

> The focus of this repo is the foundation of graph data structures in an imperative and procedural way.

The material does **not** yet cover formal algorithms such as:

- Recursive DFS
- BFS
- Dijkstra
- Topological sort
