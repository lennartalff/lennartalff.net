---
title: Lactate Test Protocol
date: '2023-03-27'
categories: ['Cycling']
tags: ['cycling', 'lactate', 'ftp']
mathjax: True
---

## MLSS Test

**Warm Up**
: 5-step ramp from `$0.5\,\text{MLSS}_{\text{guess}}$` to `$0.8\,\text{MLSS}_{\text{guess}}$`.

**Ramp**
: Starting either `$10\,\text{W}$` or `$20\,\text{W}$` below guessed MLSS. Each step the power is increased by `$10\,\text{W}$`. Lactate is measured at `$3\,\text{min}$` and `$9\,\text{min}$` for each step. Lactate concentration is considered steady as long as the increase is below `$1\,\text{mmol}/\text{l}$`.

The result is stored in a corresponding `yaml` file.

``` yaml
measurements:
  - date: 2023-03-25
    MLSS_guess: 284
    measurements:
      - power: 260
        lactate: [4.0, 4.3]
      - power: 270
        lactate: [6.0, 7.1]
  - ...
```


## General Test

**Warm Up**
: `$15\,\text{min}$` at `$0.4\,\text{FTP}$` with measurement at the end.

**Ramp**
: Starting from `$0.5\,\text{FTP}$` and increasing by `$0.1\,\text{FTP}$` per step until `$1.0\,\text{FTP}$`. `$6\,\text{min}$` per step. Test at `$5\,\text{min}$` for each step.
