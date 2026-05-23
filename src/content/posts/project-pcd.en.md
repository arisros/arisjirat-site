---
title: "Dirty Ceramic Floor Detection"
description: "This project aims to distinguish between **clean** and **dirty** ceramic floor conditions using digital image processing techniques."
category: "research"
tags: ["image-processing", "computer-vision", "python"]
status: "completed"
draft: false
repo: "https://github.com/arisros/pcd"
lang: "en"
translationKey: "project-pcd"
---

This project distinguishes between **clean** and **dirty** ceramic floor conditions using classical digital image processing. It relies on pixel intensity analysis and texture variation — no machine learning involved.

## Requirements

| Component   | Version       |
|-------------|---------------|
| Python      | 3.8 or later  |
| OpenCV      | latest        |
| NumPy       | latest        |
| Matplotlib  | latest        |

> All dependencies can be installed via `requirements.txt`.

## Project Structure

```
.
├── deteksi_lantai_kotor.py
├── requirements.txt
├── lantai.jpg
└── docs/
    └── sequence-diagram.png
```

## System Flow

<!-- TODO: add sequence_diagram.png -->

The pipeline runs in five stages:

1. Read the ceramic floor image.
2. Convert to grayscale and apply noise reduction.
3. Extract statistical features — **mean** and **standard deviation**.
4. Compare the standard deviation against a *threshold*.
5. Classify the floor as **clean** or **dirty**.

### Decision-Making Basis

Classification hinges on the standard deviation of pixel intensity:

$$\sigma = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(x_i - \mu)^2}$$

A higher $\sigma$ indicates greater texture variation on the surface, which typically signals the presence of dirt or stains.

## How to Run

Install dependencies and launch the script:

```bash
pip install -r requirements.txt
python deteksi_lantai_kotor.py
```

> Make sure the image file (`lantai.jpg`) is located at the path specified in the code.

## Output

The program produces two kinds of output:

- **Visual** — the original image, the *preprocessing* result, and the detection result.
- **Terminal** — the mean value, the standard deviation, and the system's final decision.

## Notes

- The system works best under relatively stable lighting conditions.
- The *threshold* value can be tuned to suit different environments based on testing.
