---
title: "Dirty Ceramic Floor Detection"
description: "This project aims to distinguish between **clean** and **dirty** ceramic floor conditions using digital image processing techniques."
category: "research"
lang: "en"
translationKey: "project-pcd"
repo: "https://github.com/arisros/pcd"
status: "completed"
draft: false
tags: ["image-processing", "computer-vision", "python"]
---

This project aims to distinguish between **clean** and **dirty** ceramic floor conditions using digital image processing techniques. The approach is based on pixel intensity analysis and texture variation, without involving machine learning.

## Requirements

| Component | Version |
|-----------|---------|
| Python | 3.8 or newer |
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


![Diagram alur lima tahap deteksi lantai keramik kotor](/images/inline/project-pcd-1.svg)

<!-- TODO: add sequence_diagram.png -->

In short, the system works through five stages:

1. Reading the ceramic floor image.
2. Converting the image to grayscale and reducing noise.
3. Extracting statistical features in the form of **mean** and **standard deviation**.
4. Comparing the standard deviation value against a *threshold*.
5. Determining the floor condition: **clean** or **dirty**.

### Decision-Making Basis


![Ilustrasi perbandingan standar deviasi piksel lantai bersih vs kotor](/images/inline/project-pcd-2.svg)

The classification decision relies on the standard deviation value of pixel intensity:

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

- **Visual:** the original image, *preprocessing* results, and detection results.
- **Terminal:** the mean value, standard deviation, and the system's final decision.

## Notes

- The system works optimally under relatively stable lighting conditions.
- The *threshold* value can be adjusted based on testing results in different environments.
