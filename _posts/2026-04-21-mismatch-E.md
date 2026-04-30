---
title: "Mismatch Energy"
date: 2026-04-15 10:00:00 +0800
tags: [Quantum, notes]
---



# Note on Why Extractable Energy Comes from the **Mismatch** Between $H_{\rm ent}$ and $H_A$

## 1. Setup

Consider a subsystem $A$ with physical Hamiltonian

$$
H_A=\sum_m E_m\,|E_m\rangle\langle E_m|.
$$

Let its reduced density matrix be

$$
\rho_A=\mathrm{Tr}_{\bar A}\,|\psi\rangle\langle\psi|.
$$

It is often convenient to define the **entanglement Hamiltonian** $H_{\rm ent}$ by

$$
\rho_A \equiv e^{-H_{\rm ent}}.
$$

Diagonalizing $\rho_A$ gives

$$
\rho_A
=
\sum_n p_n\,|E_{\mathrm{ent},n}\rangle\langle E_{\mathrm{ent},n}|,
\qquad
p_n\ge 0,\qquad \sum_n p_n=1,
$$

with

$$
p_n=e^{-E_{\mathrm{ent},n}}.
$$

Here:

- $|E_{\mathrm{ent},n}\rangle$ are the eigenvectors of $\rho_A$ (equivalently of $H_{\rm ent}$),
- $E_{\mathrm{ent},n}$ are the **entanglement energies**,
- $p_n$ are the eigenvalues of $\rho_A$.

The extractable work (ergotropy) is determined by how much the average energy can be lowered by a unitary acting on subsystem $A$:

$$
Q=\min_U \mathrm{Tr}\!\left(H_A\,U\rho_A U^\dagger\right),
$$

$$
W=\mathrm{Tr}(H_A\rho_A)-Q.
$$

Here $Q$ is the **bound energy** and $W$ is the **ergotropy**.

---

## 2. Why does the extractable energy depend on a mismatch?

A unitary transformation does **not** change the eigenvalues of $\rho_A$.
It only changes **where** those fixed weights are placed relative to the physical energy levels of $H_A$.

To see this explicitly, write

$$
\rho_A=\sum_n p_n\,|E_{\mathrm{ent},n}\rangle\langle E_{\mathrm{ent},n}|,
\qquad
H_A=\sum_m E_m\,|E_m\rangle\langle E_m|.
$$

Then for any unitary $U$,

$$
\mathcal E(U):=\mathrm{Tr}(H_AU\rho_AU^\dagger)
=
\sum_{m,n}
E_m\,p_n\,\left|\langle E_m|U|E_{\mathrm{ent},n}\rangle\right|^2.
$$

This formula has a very clear interpretation:

- the numbers $p_n=e^{-E_{\mathrm{ent},n}}$ are the fixed **weights**,
- the numbers $E_m$ are the fixed **physical energy levels**,
- the unitary $U$ decides how these weights are distributed over the physical energy levels.

Therefore, extractable energy exists whenever the present arrangement of the weights $p_n$ is **not yet the lowest-energy arrangement** with respect to $H_A$.

That is exactly what is meant by the **mismatch** between $H_{\rm ent}$ and $H_A$.

---

## 3. Two distinct kinds of mismatch

The phrase “mismatch” has two related but distinct meanings.

### 3.1 Basis mismatch

This occurs when the eigenbasis of $\rho_A$ is not the energy eigenbasis of $H_A$:

$$
[\rho_A,H_A]\neq 0.
$$

Equivalently, the eigenvectors $|E_{\mathrm{ent},n}\rangle$ of $H_{\rm ent}$ are not the same as the eigenvectors $|E_m\rangle$ of $H_A$.

In this case, the reduced state contains coherence in the physical energy basis.
A suitable unitary can rotate the entanglement eigenvectors into more energetically favorable directions, thereby lowering the average energy.

So here the extractable work comes from a **directional misalignment** between the two operators.

---

### 3.2 Spectral / ordering mismatch

Even if $\rho_A$ and $H_A$ commute,

$$
[\rho_A,H_A]=0,
$$

there can still be extractable work if the populations are not ordered monotonically with energy.

A state is **passive** if, in the energy basis,

$$
\rho_A=\sum_m q_m\,|E_m\rangle\langle E_m|
$$

with

$$
E_1\le E_2\le \cdots
\qquad \text{and} \qquad
q_1\ge q_2\ge \cdots.
$$

That is: larger weights must already sit on lower energy levels.

If this ordering is violated, then one can still lower the energy by swapping weights between levels.
So here the extractable work comes from a **misordering of weights relative to the physical spectrum**.

---

## 4. The optimal rearrangement

Since unitary transformations preserve the spectrum of $\rho_A$, the optimization problem is:

> Given the fixed eigenvalues $p_n$ of $\rho_A$, how should they be assigned to the energy levels $E_m$ of $H_A$ so that the average energy is minimized?

The answer is:

- sort the weights in descending order,
- sort the physical energies in ascending order,
- pair them in the opposite order.

If

$$
p_1^\downarrow \ge p_2^\downarrow \ge \cdots
$$

and

$$
E_1^\uparrow \le E_2^\uparrow \le \cdots,
$$

then the minimal energy is

$$
Q=\sum_n p_n^\downarrow E_n^\uparrow.
$$

Equivalently, since

$$
p_n=e^{-E_{\mathrm{ent},n}},
$$

sorting the $p_n$ in descending order is the same as sorting the entanglement energies $E_{\mathrm{ent},n}$ in ascending order.

Thus the optimal unitary $U_{\rm opt}$ aligns:

- the **lowest entanglement energies** (largest weights),
- with the **lowest physical energies**.

This is why $U_{\rm opt}$ and $Q$ are said to be conditioned upon both $H_{\rm ent}$ and $H_A$.

---

## 5. Physical interpretation

The reduced state $\rho_A$ tells us how the subsystem’s information is distributed.
The operator $H_A$ tells us which directions in Hilbert space are energetically cheap or expensive.

If the dominant sectors of $\rho_A$ are already aligned with the low-energy sectors of $H_A$, then the state is already close to passive, and little work can be extracted.

If not, then some large weights are “wasted” on energetically unfavorable directions or levels, and a unitary can move them downward in energy.

Therefore:

$$
\boxed{
\text{Extractable work comes from the fact that the entanglement structure of } \rho_A
\text{ is not optimally aligned with the physical energy structure of } H_A.
}
$$

This is the precise meaning of the statement that extractable energy comes from the **mismatch** between $H_{\rm ent}$ and $H_A$.

---

## 6. Why thermal states have little or no mismatch

For a thermal (Gibbs) state one has

$$
\rho_A \approx \frac{e^{-\beta H_A}}{Z}.
$$

Then

$$
H_{\rm ent}\approx \beta H_A+\ln Z.
$$

So the entanglement Hamiltonian and the physical Hamiltonian are aligned:

- they have (approximately) the same eigenbasis,
- their eigenvalue ordering is consistent.

In that case, the largest weights already occupy the lowest physical energies, and the state is passive (or nearly passive).
Hence

$$
W\approx 0.
$$

So thermalization tends to **remove the mismatch**, and with it the extractable work.

---

## 7. Why scars can have larger ergotropy

In scarred or nonthermal states, the reduced density matrix generally does **not** take the Gibbs form with respect to $H_A$.
Therefore $H_{\rm ent}$ is not simply proportional to $H_A$.

This means:

- the entanglement eigenbasis may differ from the physical energy eigenbasis,
- or the weight ordering may fail to match the physical energy ordering,
- or both.

Hence there is still room for a nontrivial $U_{\rm opt}$ to lower the energy:

$$
W>0.
$$

In this sense, scars can retain a substantial mismatch between entanglement structure and physical energy structure, and that mismatch is precisely what allows a larger extractable work.

---

## 8. Short summary

The reduced density matrix can be written as

$$
\rho_A=e^{-H_{\rm ent}}.
$$

Its eigenvalues

$$
p_n=e^{-E_{\mathrm{ent},n}}
$$

are fixed under unitary operations.
Only their placement relative to the physical Hamiltonian

$$
H_A=\sum_m E_m|E_m\rangle\langle E_m|
$$

can be changed.

Hence the ergotropy is controlled by the **relative mismatch** between:

- the spectral/eigenvector structure of $H_{\rm ent}$,
- and the spectral/eigenvector structure of $H_A$.

If they are fully aligned, the state is passive and

$$
W=0.
$$

If they are not aligned, one can lower the energy by a unitary rearrangement, and the difference becomes extractable work:

$$
W=\mathrm{Tr}(H_A\rho_A)-Q.
$$

So, in one sentence:

$$
\boxed{
\text{Extractable energy is the energetic advantage gained by optimally correcting the mismatch between } H_{\rm ent} \text{ and } H_A.
}
$$