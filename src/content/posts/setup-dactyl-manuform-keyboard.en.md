---
title: "Dactyl Manuform: A Handwired Ergonomic Split Keyboard"
description: "Building a Dactyl Manuform ergonomic split keyboard from scratch — manual wiring, QMK firmware, and self-flashing."
date: 2026-01-15
category: "setup"
lang: "en"
translationKey: "setup-dactyl-manuform-keyboard"
tags: ["keyboard", "qmk", "handwired", "ergonomic", "dactyl-manuform", "pro-micro", "split-keyboard"]
repo: "https://github.com/arisros/dactyl-manuform-keyboard"
status: "in-progress"
featured: true
tech: ["QMK", "C", "Pro Micro ATmega32U4", "TRRS"]
---

Hardware project: rebuilding a **Dactyl Manuform** keyboard — split, ergonomic, handwired — from keymap reverse-engineering all the way to flashing QMK firmware. The repository is tracked as a _setup_ because this is part of an ergonomic workstation, not a product meant to be published.

![Dactyl Manuform — top view](/images/setup-dactyl/dm.webp)

## Why Dactyl Manuform

The Dactyl Manuform is a _curved_ variant of the original Dactyl: a 3D-printed case whose key contours follow finger length, with a thumb cluster angled toward the thumb. The ergonomic payoff:

- Wrists don't need to twist.
- Fingers travel shorter distances.
- Load is absorbed by the large muscles of the hand instead of the small tendons in the palm.

> The trade-off is clear: no vendor sells a ready-made unit — everything has to be handwired, and the firmware is custom.

## Specs

### Hardware & Firmware

| Item | Detail |
| --- | --- |
| Layout | Dactyl Manuform (ergonomic split) |
| MCU | Pro Micro (ATmega32U4) × 2 |
| Firmware | [QMK](https://docs.qmk.fm) |
| Split Connection | TRRS cable |
| Matrix | 6×6 + thumb cluster per side |
| Diode Direction | COL2ROW _(not yet confirmed)_ |
| Master Side | Right (`MASTER_RIGHT`) |

### Matrix Capacity

The theoretical maximum number of keys with this configuration:

$$
K_{\text{total}} = 2 \times (6 \times 6) = 72
$$

In practice the count is lower, since not every matrix point is used — some are repurposed as a thumb cluster mapped onto the same rows and columns.

![Dactyl Manuform — side view](/images/setup-dactyl/dm2.webp)

## Reconstruction Plan (7 Phases)

The project is organized as a phased rebuild. Each phase has a verifiable output before moving on to the next:

- [ ] **Phase 1** — Reverse the keymap from the old firmware (manual key testing)
- [ ] **Phase 2** — Scaffold the QMK project structure
- [ ] **Phase 3** — Configuration files (`config.h`, `info.json`)
- [ ] **Phase 4** — Keymap template (`keymap.c` with all layers)
- [ ] **Phase 5** — Confirm the master method (`MASTER_RIGHT` vs `EE_HANDS`)
- [ ] **Phase 6** — Safe flashing (compile → flash → repeat for the other side)
- [ ] **Phase 7** — Matrix debugging via `qmk console`

> ⚠️ The QMK files are currently still placeholders. Pin assignments and matrix size must be confirmed after the physical Phase 1 is done — if they're wrong, key events won't be detected or will register at the wrong positions.

## Repository Structure

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

### QMK Setup

One-time install of QMK via `pip`:

```bash
pip install qmk
qmk setup
```

### Compile & Flash

Copy the keyboard folder into the QMK firmware directory, then compile and flash:

```bash
cp -r firmware/qmk/dactyl_manuform_custom \
      ~/qmk_firmware/keyboards/handwired/

qmk compile -kb handwired/dactyl_manuform_custom -km default
qmk flash   -kb handwired/dactyl_manuform_custom -km default
```

> Flashing is done **one side at a time**: plug in the side you want to flash, press the reset button when prompted, then repeat for the other side.

## Tools

| Tool | Purpose |
| --- | --- |
| [Neovim](https://neovim.io) | Main editor |
| [tmux](https://github.com/tmux/tmux) | Terminal multiplexer |
| [QMK CLI](https://docs.qmk.fm/#/cli) | Build & flash firmware |
| Pro Micro (ATmega32U4) × 2 | Microcontroller per side |

## References

| Resource | Link |
| --- | --- |
| QMK Documentation | <https://docs.qmk.fm> |
| QMK Split Keyboard | <https://docs.qmk.fm/#/feature_split_keyboard> |
| Pro Micro Pinout | <https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide> |
| Dactyl Manuform QMK | <https://github.com/qmk/qmk_firmware/tree/master/keyboards/handwired/dactyl_manuform> |
| Keyboard Tester | <https://www.keyboardtester.com> |

## Status

This project is **in-progress**. Progress updates are tracked in `docs/build_log.md` in the repo. Once Phase 1 is finished and the matrix pins are confirmed, this post will be updated with the final keymap and the custom layers used day to day.
