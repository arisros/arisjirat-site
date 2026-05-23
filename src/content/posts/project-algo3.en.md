---
title: "ALGO3 - Graph (Adjacency Matrix, C)"
description: "This repository is prepared for the ALGO3 teaching pattern based on:"
category: "study"
tags: ["algorithms", "graph", "c-programming"]
status: "completed"
draft: false
image: "/images/banners/project-algo3.png"
lang: "en"
translationKey: "project-algo3"
---

## Summary

This repository supports the **ALGO3** teaching pattern using an imperative graph representation in C. The approach is intentionally simple to keep the foundations of data structures and model translation explicit.

### Scope

- Graph representation with `int M[n][n]`
- Translation of **model → data → operation**
- Direct queries, multi-step queries, and matrix traversal
- Path enumeration via *brute force* (without formal DFS/BFS)

## Directory Structure

| File | Topic |
| --- | --- |
| `pertemuan1/graph_tak_berarah.c` | Undirected graph: degree and basic queries |
| `pertemuan2/graph_berarah.c` | Directed graph: indegree/outdegree, two-step queries |
| `pertemuan3/cetak_semua_path.c` | Print all A → D paths without revisiting (brute force, per `tugas3.png`) |
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

> This repo focuses on the foundation of graph data structures in an imperative, procedural style.

The material does **not** yet cover formal algorithms such as:

- Recursive DFS
- BFS
- Dijkstra
- Topological sort
