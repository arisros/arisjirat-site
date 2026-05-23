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

This project aims to distinguish between **clean** and **dirty** ceramic floor conditions using digital image processing techniques. The approach is based on pixel intensity analysis and texture variation, without involving machine learning.

## Requirements

| Component | Version |
|-----------|---------|
| Python | 3.8 or later |
| OpenCV | latest |
| NumPy | latest |
| Matplotlib | latest |

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

In summary, the system works through the following five stages:

1. Read the ceramic floor image.
2. Convert the image to grayscale and perform noise reduction.
3. Extract statistical features in the form of **mean** and **standard deviation**.
4. Compare the standard deviation value against a *threshold*.
5. Determine the floor condition: **clean** or **dirty**.

### Decision-Making Basis

The classification decision is based on the standard deviation of pixel intensity:

$$\sigma = \sqrt{\frac{1}{N}\sum_{i=1}^{N}(x_i - \mu)^2}$$

The higher the $\sigma$, the greater the texture variation on the surface — which generally indicates the presence of dirt or stains.

## How to Run

```bash
pip install -r requirements.txt
python deteksi_lantai_kotor.py
```

> Make sure the image file (`lantai.jpg`) is located at the path specified in the code.

## Output

The program produces two types of output:

- **Visual:** the original image, *preprocessing* result, and detection result.
- **Terminal:** the mean value, standard deviation, and the system's final decision.

## Notes

- The system works optimally under relatively stable lighting conditions.
- The *threshold* value can be adjusted based on testing results in different environments.
