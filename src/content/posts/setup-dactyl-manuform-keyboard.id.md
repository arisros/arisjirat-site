---
title: "Dactyl Manuform: Keyboard Split Ergonomis Handwired"
description: "Membangun keyboard split ergonomis Dactyl Manuform dari nol — wiring manual, firmware QMK, dan flashing sendiri."
date: 2026-01-15
category: "setup"
lang: "id"
translationKey: "setup-dactyl-manuform-keyboard"
tags: ["keyboard", "qmk", "handwired", "ergonomic", "dactyl-manuform", "pro-micro", "split-keyboard"]
repo: "https://github.com/arisros/dactyl-manuform-keyboard"
status: "in-progress"
featured: true
tech: ["QMK", "C", "Pro Micro ATmega32U4", "TRRS"]
---

Proyek hardware: membangun ulang keyboard **Dactyl Manuform** — split, ergonomis, handwired — dari fase reverse-engineering keymap sampai flashing firmware QMK. Repository di-track sebagai _setup_ karena ini bagian dari ergonomic workstation, bukan produk yang akan dipublikasikan.

![Dactyl Manuform — top view](/images/setup-dactyl/dm.webp)

## Kenapa Dactyl Manuform

Dactyl Manuform adalah varian _curved_ dari Dactyl asli: case 3D-printed dengan kontur kunci yang mengikuti panjang jari, plus cluster thumb yang dimiringkan ke arah ibu jari. Hasilnya:

- Pergelangan tangan tidak perlu memutar.
- Jari menempuh jarak lebih pendek.
- Beban diserap oleh otot besar tangan, bukan tendon kecil di telapak.

> Trade-off-nya jelas: tidak ada vendor jadi yang menjual unit ini — semua harus handwired, dan firmware-nya kustom.

## Spesifikasi

### Hardware & Firmware

| Item | Detail |
| --- | --- |
| Layout | Dactyl Manuform (split ergonomis) |
| MCU | Pro Micro (ATmega32U4) × 2 |
| Firmware | [QMK](https://docs.qmk.fm) |
| Koneksi Split | Kabel TRRS |
| Matrix | 6×6 + thumb cluster per sisi |
| Arah Diode | COL2ROW _(belum dikonfirmasi)_ |
| Master Side | Kanan (`MASTER_RIGHT`) |

### Kapasitas Matrix

Jumlah key teoretis maksimum dengan konfigurasi ini:

$$
K_{\text{total}} = 2 \times (6 \times 6) = 72
$$

Praktiknya lebih sedikit karena tidak semua titik matrix terpakai — sebagian dipakai sebagai thumb cluster yang dimapping ke baris/kolom yang sama.

![Dactyl Manuform — side view](/images/setup-dactyl/dm2.webp)

## Rencana Rekonstruksi (7 Fase)

Project ini diorganisir sebagai phased rebuild. Tiap fase punya output yang bisa diverifikasi sebelum lanjut ke fase berikutnya:

- [ ] **Fase 1** — Reverse keymap dari firmware lama (manual key testing)
- [ ] **Fase 2** — Scaffold struktur project QMK
- [ ] **Fase 3** — File konfigurasi (`config.h`, `info.json`)
- [ ] **Fase 4** — Template keymap (`keymap.c` dengan semua layer)
- [ ] **Fase 5** — Konfirmasi metode master (`MASTER_RIGHT` vs `EE_HANDS`)
- [ ] **Fase 6** — Flashing aman (compile → flash → ulangi sisi lain)
- [ ] **Fase 7** — Debugging matrix lewat `qmk console`

> ⚠️ File QMK saat ini masih placeholder. Pin assignment dan ukuran matrix harus dikonfirmasi setelah Fase 1 fisik selesai — kalau salah, key event tidak akan terdeteksi atau ter-register di posisi yang keliru.

## Struktur Repository

```
.
├── docs/
│   ├── reconstruction_plan.md   # Rencana rekonstruksi firmware
│   ├── build_log.md             # Catatan progress
│   └── images/
├── firmware/
│   └── qmk/
│       └── dactyl_manuform_custom/
│           ├── config.h                    # ⚠️ pin placeholder
│           ├── info.json
│           ├── rules.mk
│           ├── dactyl_manuform_custom.h    # macro LAYOUT
│           ├── dactyl_manuform_custom.c
│           └── keymaps/
│               └── default/
│                   ├── keymap.c            # 4 layer
│                   ├── config.h
│                   └── rules.mk
├── LICENSE
└── README.md
```

## Build & Flash

### Setup QMK

Sekali saja, install QMK lewat `pip`:

```bash
pip install qmk
qmk setup
```

### Compile & Flash

Salin folder keyboard ke direktori QMK firmware, lalu compile dan flash:

```bash
cp -r firmware/qmk/dactyl_manuform_custom \
      ~/qmk_firmware/keyboards/handwired/

qmk compile -kb handwired/dactyl_manuform_custom -km default
qmk flash   -kb handwired/dactyl_manuform_custom -km default
```

> Flash dilakukan **per sisi**: colok sisi yang mau di-flash, tekan tombol reset saat diminta, ulangi untuk sisi satunya.

## Tools

| Tool | Tujuan |
| --- | --- |
| [Neovim](https://neovim.io) | Editor utama |
| [tmux](https://github.com/tmux/tmux) | Terminal multiplexer |
| [QMK CLI](https://docs.qmk.fm/#/cli) | Build & flash firmware |
| Pro Micro (ATmega32U4) × 2 | Microcontroller per sisi |

## Referensi

| Resource | Link |
| --- | --- |
| QMK Documentation | <https://docs.qmk.fm> |
| QMK Split Keyboard | <https://docs.qmk.fm/#/feature_split_keyboard> |
| Pro Micro Pinout | <https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide> |
| Dactyl Manuform QMK | <https://github.com/qmk/qmk_firmware/tree/master/keyboards/handwired/dactyl_manuform> |
| Keyboard Tester | <https://www.keyboardtester.com> |

## Status

Project ini **in-progress**. Update progress di-track di `docs/build_log.md` di repo. Begitu Fase 1 selesai dan pin matrix terkonfirmasi, post ini akan diperbarui dengan keymap final dan layer-layer custom yang dipakai harian.
