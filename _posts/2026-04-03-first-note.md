---
title: ""
date: 2026-04-03 10:00:00 +0800
thumbnail: /images/cartoon1.png
tags: [notes, theory, example]
---

### Build EoM on bins

Definition of `Abin`:

$$
A_{\mathrm{bin}}(i)=\pi\left[\left(k_{i+1}^{\mathrm{edge}}\right)^2-\left(k_i^{\mathrm{edge}}\right)^2\right].
$$

```python
Abin = π * (kvec[1:]**2 - kvec[:-1]**2)  # [1/nm²] momentum bin areas
```

First, write the continuous form (\(F(k') = N(k')\) or \(P(k')\)):

$$
\left.\frac{dN(k)}{dt}\right|_{\mathrm{gain}}
= \int d^2k' \, G_{\mathrm{cont}}(k, k') \, F(k').
$$

$$
\text{integrand\_G} \sim
\underbrace{k\,dk\,d\varphi}_{d^2k}
\underbrace{k' dk'}_{d^2k'} \times 2\pi
\times \underbrace{\frac{A}{(2\pi)^2}}_{\text{normalized}}
\times \delta(\text{energy conservation})
\times \underbrace{g^2(q)}_{\text{coupling}}
\times \underbrace{(1+n, n)}_{\text{emit/absorb phonon}}.
$$

$$
I_{ij} \equiv \int_{\text{bin }i} d^2k \int_{\text{bin }j} d^2k' \, G_{\mathrm{cont}}(k, k').
$$

$$
G[i, j] = \frac{2}{A_{\mathrm{bin}, i} A_{\mathrm{bin}, j}} I_{ij}.
$$

In code:

```python
G[i, j] = 2 * (
    1 / (Abin[i] * Abin[j])
    * integrate(integrand_G, kvec[i], kvec[i + 1], kvec[j], kvec[j + 1], epsabs, epsrel)
)
```

We want the discrete EoM to be:

```python
dN_ther[i] += (1 / ħ) * Abin[j] * G[i, j] * N[j]
```

$$
\frac{dN_i}{dt} \approx \sum_j A_j \, G[i, j] \, F_j.
$$

**LHS**

$$
\frac{1}{A_i} \int_{\text{bin }i} d^2k \, \frac{dN(k)}{dt}
$$

**RHS**

$$
\sum_j A_j G[i, j] F_j
= \sum_j \frac{2}{A_i} I_{ij} F_j
= \sum_j \frac{2}{A_i} \int_{\text{bin }i} d^2k \int_{\text{bin }j} d^2k'
\, G_{\mathrm{cont}}(k, k') \, \frac{1}{A_j} \int_{\text{bin }j} d^2k'' F(k'').
$$

Assume \(F(k'')\) varies smoothly in `bin j`:

$$
\sum_j \frac{2}{A_i} \int_{\text{bin }i} d^2k \int_{\text{bin }j} d^2k'
\, G_{\mathrm{cont}}(k, k') \, \frac{1}{A_j} \int_{\text{bin }j} d^2k'' F(k'')
= \frac{2}{A_i} \int_{\text{bin }i} d^2k \int d^2k' \, G_{\mathrm{cont}}(k, k') F(k').
$$

Remove the `bin i` integral over \(k\) from both sides:

$$
\frac{dN(k)}{dt} = 2 \int d^2k' \, G_{\mathrm{cont}}(k, k') F(k').
$$
