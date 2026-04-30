---
title: "Dipole on exciton's basis"
date: 2026-04-05 10:00:00 +0800
tags: [exciton, notes]
---




# Exciton basis expansion and light--matter interaction

We start from the exciton creation operator

$$
B_{\mu,K}^{\dagger}
=
\sum_{q'}
\phi_{\mu}(q')\,
\alpha^{\dagger}_{\frac{m_e}{M}K-q'}\,
\beta^{\dagger}_{\frac{m_h}{M}K+q'}.
$$

Multiply by $\phi_\mu^*(q)$ and sum over $\mu$:

$$
\sum_{\mu}\phi_\mu^*(q)\,B_{\mu,K}^{\dagger}
=
\sum_{q'}\sum_{\mu}
\phi_\mu^*(q)\phi_\mu(q')\,
\alpha^{\dagger}_{\frac{m_e}{M}K-q'}\,
\beta^{\dagger}_{\frac{m_h}{M}K+q'}.
$$

Using completeness,

$$
\sum_\mu \phi_\mu^*(q)\phi_\mu(q')
=
\delta_{q,q'},
$$

we get

$$
\sum_{\mu}\phi_\mu^*(q)\,B_{\mu,K}^{\dagger}
=
\sum_{q'}
\delta_{q,q'}\,
\alpha^{\dagger}_{\frac{m_e}{M}K-q'}\,
\beta^{\dagger}_{\frac{m_h}{M}K+q'}
=
\alpha^{\dagger}_{\frac{m_e}{M}K-q}\,
\beta^{\dagger}_{\frac{m_h}{M}K+q}.
$$

Thus we have expanded $\alpha^\dagger \beta^\dagger$ on the exciton basis:

$$
\beta^{\dagger}_{\frac{m_h}{M}K+q}\,
\alpha^{\dagger}_{\frac{m_e}{M}K-q}
=
\sum_{\mu}\phi_\mu^*(q)\,B_{\mu,K}^{\dagger}.
$$

---

Now consider the interaction Hamiltonian:

$$
H_I
=
\sum_{K,q}
d_{vc}\,
\beta_{\frac{m_h}{M}K+q}\,
\alpha_{\frac{m_e}{M}K-q}\,
E(K)\,e^{-i\omega_K t}
+ \mathrm{h.c.}
$$

Using the quantized electric field amplitude

$$
E(K)
\;\to\;
-i\sqrt{\frac{\hbar\omega}{2\varepsilon_0 N z_0}}\,
a_K^\dagger,
$$

where $a_q^\dagger$ creates a photon, we obtain

$$
H_I
=
\sum_{K,q,\mu}
d_{vc}\,\phi_\mu(q)\,B_{\mu,K}\,
\left(
-i\sqrt{\frac{\hbar\omega}{2\varepsilon_0 N z_0}}
\right)
a_K^\dagger e^{-i\omega_K t}
+\mathrm{h.c.}
$$

If we use

$$
\sum_q e^{i q\cdot 0}\,\phi_\mu(q)
=
\sum_q \phi_\mu(q)
=
\phi_\mu(r=0),
$$

then we may write schematically

$$
H_I
=
-i\sqrt{\frac{\hbar\omega}{2\varepsilon_0}}\,
\frac{1}{\sqrt{N}}
\sum_{K,\mu}
d_{vc}\,\phi_\mu(r=0)\,
B_{\mu,K}\,a_K^\dagger
+\mathrm{h.c.}
$$

Hence the effective dipole moment is

$$
d_{\mathrm{eff}}
\propto
d_{vc}\,\phi_\mu(r=0).
$$

For a 2D hydrogen-like wavefunction,

$$
\phi_{1s}(0)\neq 0.
$$

So one expects the $1s$ exciton to be optically active.

---

## Remark on $N z_0$

In the field quantization factor

$$
\sqrt{\frac{\hbar\omega}{2\varepsilon_0 N z_0}},
$$

the combination $N z_0$ is usually playing the role of an effective quantization volume. More standard notation would be

$$
\sqrt{\frac{\hbar\omega}{2\varepsilon_0 V}},
$$

with

$$
V = A L_z.
$$

So in practice you may interpret

$$
N z_0 \leftrightarrow V_{\mathrm{quant}}.
$$