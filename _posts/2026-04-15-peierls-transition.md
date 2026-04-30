---
title: "Peierls Transition"
date: 2026-04-15 10:00:00 +0800
tags: [cmt, notes]
---

# Peierls Transition 中的电子-声子作用与声子软化推导笔记

## 0. 说明与目标

本文给出一维 Peierls transition 中电子-声子耦合项的微观推导，并进一步说明为什么在
$q=2k_F$ 处会发生声子软化，从而诱导晶格失稳与二聚化。

整个推导采用如下标准假设：

1. 体系是一维单原子链。
2. 电子可由最近邻紧束缚模型描述。
3. 晶格位移较小，因此只保留位移的一阶项。
4. 离子之间采用谐振近似。
5. 关注 Peierls/SSH 型耦合，即 **键长变化导致 hopping 变化**，而不是 Holstein 型局域密度-位移耦合。
6. 推导声子软化时采用静态或绝热极限，即使用 $\chi(q,\omega\to 0)$。

---

## 1. 实空间微观模型

设第 $n$ 个离子的平衡位置为

$$
R_n^{(0)} = na,
$$

其中 $a$ 是晶格常数。实际位置写为

$$
R_n = na + u_n,
$$

这里：

- $u_n$：第 $n$ 个离子的位移；
- $n=1,\dots,N$；
- $N$：晶格总格点数。

电子湮灭与产生算符分别记为 $c_{n\sigma}$ 与 $c_{n\sigma}^\dagger$，其中 $\sigma$ 是自旋指标。

总哈密顿量取为

$$
H = H_{\mathrm{el}} + H_{\mathrm{ph}}.
$$

### 1.1 电子部分

由于相邻原子之间的 hopping 依赖于实际键长 $R_{n+1}-R_n$，电子哈密顿量写作

$$
H_{\mathrm{el}}
=
-\sum_{n,\sigma} t(R_{n+1}-R_n)
\left(
c_{n\sigma}^\dagger c_{n+1,\sigma}
+
c_{n+1,\sigma}^\dagger c_{n\sigma}
\right).
\tag{1}
$$

### 1.2 晶格部分

晶格采用最近邻谐振模型：

$$
H_{\mathrm{ph}}
=
\sum_n \frac{p_n^2}{2M}
+
\frac{K}{2}\sum_n (u_{n+1}-u_n)^2.
\tag{2}
$$

这里：

- $p_n$：与 $u_n$ 共轭的离子动量；
- $M$：离子质量；
- $K$：最近邻等效弹簧常数。

---

## 2. 从键长依赖的 hopping 得到 Peierls 型电子-声子作用

### 2.1 键长的线性展开

相邻两点实际距离为

$$
R_{n+1}-R_n = a + u_{n+1}-u_n.
\tag{3}
$$

由于位移较小，可在平衡位置 $a$ 附近对 hopping 做一阶展开：

$$
t(R_{n+1}-R_n)
=
t\!\left(a+u_{n+1}-u_n\right)
\approx
t_0
+
\left.\frac{dt}{dr}\right|_{r=a}(u_{n+1}-u_n),
\tag{4}
$$

其中

$$
t_0 \equiv t(a).
$$

定义电子-晶格耦合常数

$$
\alpha \equiv -\left.\frac{dt}{dr}\right|_{r=a},
\tag{5}
$$

则

$$
t(R_{n+1}-R_n)\approx t_0-\alpha(u_{n+1}-u_n).
\tag{6}
$$

由于轨道重叠通常随距离增大而减小，所以通常 $\alpha>0$。

---

### 2.2 总哈密顿量的分解

把式 (6) 代入式 (1)：

$$
H_{\mathrm{el}}
=
-\sum_{n,\sigma}
\left[t_0-\alpha(u_{n+1}-u_n)\right]
\left(
c_{n\sigma}^\dagger c_{n+1,\sigma}
+
c_{n+1,\sigma}^\dagger c_{n\sigma}
\right).
\tag{7}
$$

展开后可写为

$$
H = H_0 + H_{e\text{-}ph},
\tag{8}
$$

其中无相互作用部分为

$$
H_0
=
-t_0\sum_{n,\sigma}
\left(
c_{n\sigma}^\dagger c_{n+1,\sigma}
+
c_{n+1,\sigma}^\dagger c_{n\sigma}
\right)
+
\sum_n \frac{p_n^2}{2M}
+
\frac{K}{2}\sum_n (u_{n+1}-u_n)^2,
\tag{9}
$$

而电子-声子耦合项为

$$
H_{e\text{-}ph}
=
\alpha \sum_{n,\sigma}(u_{n+1}-u_n)
\left(
c_{n\sigma}^\dagger c_{n+1,\sigma}
+
c_{n+1,\sigma}^\dagger c_{n\sigma}
\right).
\tag{10}
$$

这就是 **Peierls/SSH 型电子-声子耦合**。它的本质不是“局域位移乘局域密度”，而是：

$$
\text{bond distortion} \times \text{bond electron operator}.
$$

---

## 3. 先对无相互作用部分做傅里叶变换

---

### 3.1 电子部分的动量表象

定义傅里叶变换

$$
c_{n\sigma}
=
\frac{1}{\sqrt{N}}\sum_k e^{ikna} c_{k\sigma},
\qquad
c_{n\sigma}^\dagger
=
\frac{1}{\sqrt{N}}\sum_k e^{-ikna} c_{k\sigma}^\dagger.
\tag{11}
$$

将其代入式 (9) 中的电子动能项，先看

$$
-t_0\sum_{n,\sigma} c_{n\sigma}^\dagger c_{n+1,\sigma}.
\tag{12}
$$

代入后有

$$
-t_0\sum_{n,\sigma}
\left(
\frac{1}{\sqrt{N}}\sum_{k'} e^{-ik'na} c_{k'\sigma}^\dagger
\right)
\left(
\frac{1}{\sqrt{N}}\sum_k e^{ik(n+1)a} c_{k\sigma}
\right).
$$

整理为

$$
-\frac{t_0}{N}
\sum_{n,\sigma}\sum_{k,k'}
e^{i(k-k')na}e^{ika}
c_{k'\sigma}^\dagger c_{k\sigma}.
\tag{13}
$$

利用

$$
\sum_n e^{i(k-k')na}=N\delta_{k,k'},
\tag{14}
$$

得

$$
-t_0\sum_{n,\sigma} c_{n\sigma}^\dagger c_{n+1,\sigma}
=
-t_0\sum_{k,\sigma} e^{ika} c_{k\sigma}^\dagger c_{k\sigma}.
\tag{15}
$$

再加上 Hermitian conjugate：

$$
-t_0\sum_{n,\sigma}
\left(
c_{n\sigma}^\dagger c_{n+1,\sigma}
+
c_{n+1,\sigma}^\dagger c_{n\sigma}
\right)
=
\sum_{k,\sigma}\varepsilon_k c_{k\sigma}^\dagger c_{k\sigma},
\tag{16}
$$

其中色散关系为

$$
\varepsilon_k=-2t_0\cos(ka).
\tag{17}
$$

因此电子自由部分对角化为

$$
H_{\mathrm{el}}^{(0)}
=
\sum_{k,\sigma}\varepsilon_k c_{k\sigma}^\dagger c_{k\sigma}.
\tag{18}
$$

---

### 3.2 声子部分的动量表象

定义位移和动量的傅里叶变换

$$
u_n=\frac{1}{\sqrt{N}}\sum_q e^{iqna}u_q,
\qquad
p_n=\frac{1}{\sqrt{N}}\sum_q e^{iqna}p_q.
\tag{19}
$$

于是

$$
u_{n+1}-u_n
=
\frac{1}{\sqrt{N}}\sum_q e^{iqna}(e^{iqa}-1)u_q.
\tag{20}
$$

将其代入晶格哈密顿量，可得一维单原子链的声子色散

$$
\omega_q
=
2\sqrt{\frac{K}{M}}\left|\sin\frac{qa}{2}\right|.
\tag{21}
$$

再引入标准玻色量子化：

$$
u_q
=
\sqrt{\frac{\hbar}{2M\omega_q}}(b_q+b^\dagger_{-q}),
\tag{22}
$$

则

$$
H_{\mathrm{ph}}
=
\sum_q \hbar\omega_q\left(b_q^\dagger b_q+\frac12\right).
\tag{23}
$$

---

## 4. 电子-声子耦合项的动量空间推导

现在从式 (10) 出发，把它完整地写成动量空间形式。

---

### 4.1 先处理第一项

先看

$$
\sum_n (u_{n+1}-u_n)c_n^\dagger c_{n+1}.
\tag{24}
$$

代入式 (11) 和式 (20)：

$$
\sum_n
\left[
\frac{1}{\sqrt N}\sum_q e^{iqna}(e^{iqa}-1)u_q
\right]
\left[
\frac{1}{\sqrt N}\sum_{k'} e^{-ik'na}c_{k'}^\dagger
\right]
\left[
\frac{1}{\sqrt N}\sum_k e^{ik(n+1)a}c_k
\right].
\tag{25}
$$

系数合并后得到

$$
\frac{1}{N^{3/2}}
\sum_{n,q,k,k'}
e^{i(q-k'+k)na}
(e^{iqa}-1)e^{ika}
u_q\, c_{k'}^\dagger c_k.
\tag{26}
$$

对 $n$ 求和：

$$
\sum_n e^{i(q-k'+k)na}=N\delta_{k',k+q},
\tag{27}
$$

因此

$$
\sum_n (u_{n+1}-u_n)c_n^\dagger c_{n+1}
=
\frac{1}{\sqrt N}\sum_{k,q}
(e^{iqa}-1)e^{ika}
u_q\, c_{k+q}^\dagger c_k.
\tag{28}
$$

---

### 4.2 再处理 Hermitian conjugate 项

同理，

$$
\sum_n (u_{n+1}-u_n)c_{n+1}^\dagger c_n
=
\frac{1}{\sqrt N}\sum_{k,q}
(e^{iqa}-1)e^{-i(k+q)a}
u_q\, c_{k+q}^\dagger c_k.
\tag{29}
$$

---

### 4.3 合并结果

因此式 (10) 可写成

$$
H_{e\text{-}ph}
=
\frac{\alpha}{\sqrt N}\sum_{k,q,\sigma}
g_u(k,q)u_q\,
c_{k+q,\sigma}^\dagger c_{k,\sigma},
\tag{30}
$$

其中

$$
g_u(k,q)
=
(e^{iqa}-1)e^{ika}
+
(e^{iqa}-1)e^{-i(k+q)a}.
\tag{31}
$$

把它化简。注意

$$
(e^{iqa}-1)e^{ika}=e^{i(k+q)a}-e^{ika},
\tag{32}
$$

以及

$$
(e^{iqa}-1)e^{-i(k+q)a}=e^{-ika}-e^{-i(k+q)a}.
\tag{33}
$$

两式相加得

$$
g_u(k,q)
=
\left[e^{i(k+q)a}-e^{-i(k+q)a}\right]
-
\left[e^{ika}-e^{-ika}\right].
\tag{34}
$$

利用

$$
e^{ix}-e^{-ix}=2i\sin x,
\tag{35}
$$

得

$$
g_u(k,q)=2i\left[\sin((k+q)a)-\sin(ka)\right].
\tag{36}
$$

因此

$$
H_{e\text{-}ph}
=
\frac{\alpha}{\sqrt N}\sum_{k,q,\sigma}
2i\left[\sin((k+q)a)-\sin(ka)\right]
u_q\,
c_{k+q,\sigma}^\dagger c_{k,\sigma}.
\tag{37}
$$

再代入位移量子化式 (22)，得到

$$
H_{e\text{-}ph}
=
\frac{1}{\sqrt N}\sum_{k,q,\sigma}
g(k,q)(b_q+b_{-q}^\dagger)c_{k+q,\sigma}^\dagger c_{k,\sigma},
\tag{38}
$$

其中耦合顶角为

$$
g(k,q)
=
2i\alpha\sqrt{\frac{\hbar}{2M\omega_q}}
\left[\sin((k+q)a)-\sin(ka)\right].
\tag{39}
$$

再利用三角恒等式

$$
\sin A-\sin B = 2\cos\frac{A+B}{2}\sin\frac{A-B}{2},
\tag{40}
$$

可将式 (39) 改写为

$$
g(k,q)
=
4i\alpha\sqrt{\frac{\hbar}{2M\omega_q}}
\sin\frac{qa}{2}\cos\left(ka+\frac{qa}{2}\right).
\tag{41}
$$

---

## 5. 为什么会出现 \(q=2k_F\) 的特殊性

Peierls 转变的核心是：**某个静态晶格畸变会把费米面附近的电子态强烈混合，从而降低电子总能量**。

设存在一个静态畸变波矢 $Q$：

$$
u_n = u_Q e^{iQna}+u_{-Q}e^{-iQna}.
\tag{42}
$$

则电子-声子耦合中的静态部分相当于

$$
H_{e\text{-}ph}^{\mathrm{static}}
=
\sum_{k,\sigma}
\left[
\Delta_Q(k)c_{k+Q,\sigma}^\dagger c_{k,\sigma}
+
\Delta_Q^*(k)c_{k,\sigma}^\dagger c_{k+Q,\sigma}
\right],
\tag{43}
$$

其中

$$
\Delta_Q(k)
=
\frac{\alpha}{\sqrt N}g_u(k,Q)u_Q.
\tag{44}
$$

这说明静态畸变的作用是：**把动量为 $k$ 的电子态与动量为 $k+Q$ 的电子态耦合起来**。

因此在每个固定的 $(k,k+Q)$ 子空间中，电子哈密顿量可写成一个 $2\times 2$ 矩阵：

$$
H_k=
\begin{pmatrix}
\varepsilon_k & \Delta_Q(k)\\
\Delta_Q^*(k) & \varepsilon_{k+Q}
\end{pmatrix}.
\tag{45}
$$

对角化后本征能量为

$$
E_{k,\pm}
=
\frac{\varepsilon_k+\varepsilon_{k+Q}}{2}
\pm
\sqrt{
\left(\frac{\varepsilon_k-\varepsilon_{k+Q}}{2}\right)^2
+
|\Delta_Q(k)|^2
}.
\tag{46}
$$

若 $Q$ 恰好把两个费米点连接起来，即

$$
Q=2k_F,
\tag{47}
$$

那么靠近费米面的两个近简并态会被最强地混合，于是费米能附近打开能隙，电子总能降低最多。因此最有利的畸变正是

$$
Q=2k_F.
\tag{48}
$$

对于半填充的一维最近邻紧束缚链，

$$
k_F=\frac{\pi}{2a},
\qquad
2k_F=\frac{\pi}{a}.
\tag{49}
$$

于是最稳定的静态畸变是

$$
u_n = (-1)^n \zeta,
\tag{50}
$$

即相邻键交替伸缩，也就是**二聚化**。

---

## 6. 从响应函数看声子软化

下面说明为什么在 $q=2k_F$ 处声子频率会下降。

---

### 6.1 把声子模看成电子的外场

对于给定波矢 $q$ 的静态位移模，电子所感受到的微扰可以写成

$$
\delta H_q = u_q B_{-q}+u_{-q}B_q,
\tag{51}
$$

其中定义

$$
B_q
\equiv
\frac{\alpha}{\sqrt N}
\sum_{k,\sigma}
g_u(k,q)c_{k+q,\sigma}^\dagger c_{k,\sigma}.
\tag{52}
$$

在低能、尤其是接近 $q=2k_F$ 时，若只关心费米点附近电子，可以把 $g_u(k,q)$ 近似为费米面上的平滑值 $g_F(q)$，于是

$$
B_q \approx g_F(q)\rho_q,
\tag{53}
$$

其中

$$
\rho_q = \sum_{k,\sigma} c_{k+q,\sigma}^\dagger c_{k,\sigma}
\tag{54}
$$

是电子密度算符的傅里叶分量。

这说明尽管 Peierls/SSH 耦合微观上是“键耦合”，但在低能有效理论中，它同样通过电子粒子-空穴响应来修正声子动力学。

---

### 6.2 电子自由能的二阶修正

设电子看到的外势为

$$
\delta V_q = g_F(q)u_q.
\tag{55}
$$

根据线性响应理论，

$$
\delta n_q = \chi_0(q,0)\delta V_q,
\tag{56}
$$

其中 $\chi_0(q,\omega)$ 是非相互作用电子的 Lindhard 响应函数。动态表达式为

$$
\chi_0(q,\omega)
=
\frac{1}{L}\sum_k
\frac{f_k-f_{k-q}}
{\hbar\omega+\varepsilon_k-\varepsilon_{k-q}+i0^+}.
\tag{57}
$$

静态极限即 $\omega\to 0$。

电子自由能对外场的二阶修正可写为

$$
\delta F_e
=
\int_0^1 d\lambda \sum_q \delta V_q\, \delta n_{-q}(\lambda),
\tag{58}
$$

而在线性响应下，

$$
\delta n_{-q}(\lambda)=\lambda\chi_0(q,0)\delta V_{-q}.
\tag{59}
$$

代入式 (58)：

$$
\delta F_e
=
\int_0^1 d\lambda \sum_q
\delta V_q\,
\lambda\chi_0(q,0)\delta V_{-q}.
\tag{60}
$$

对 $\lambda$ 积分：

$$
\delta F_e
=
\frac12\sum_q \chi_0(q,0)|\delta V_q|^2.
\tag{61}
$$

再用式 (55)，得到

$$
\delta F_e
=
\frac12\sum_q |g_F(q)|^2\chi_0(q,0)|u_q|^2.
\tag{62}
$$

而晶格本身的谐振自由能为

$$
F_{\mathrm{lat}}^{(2)}
=
\frac12\sum_q M\omega_q^2|u_q|^2.
\tag{63}
$$

所以总二阶自由能为

$$
F^{(2)}
=
\frac12\sum_q
\left[
M\omega_q^2 + |g_F(q)|^2\chi_0(q,0)
\right]|u_q|^2.
\tag{64}
$$

这意味着重整化声子频率满足

$$
M\Omega_q^2
=
M\omega_q^2 + |g_F(q)|^2\chi_0(q,0).
\tag{65}
$$

由于一般有

$$
\chi_0(q,0)<0,
\tag{66}
$$

因此第二项会降低 $\Omega_q^2$，这就是**声子软化**。

---

## 7. 一维静态 Lindhard 函数的显式推导

下面严格推导一维自由电子体系中 $\chi_0(q,0)$ 的形式。

取抛物线色散

$$
\varepsilon_k=\frac{\hbar^2 k^2}{2m},
\tag{67}
$$

零温时费米分布是

$$
f_k=\theta(k_F-|k|).
\tag{68}
$$

含自旋简并 2 的静态 Lindhard 函数为

$$
\chi_0(q,0)
=
2\int\frac{dk}{2\pi}
\frac{f_k-f_{k+q}}{\varepsilon_k-\varepsilon_{k+q}}.
\tag{69}
$$

先处理分母：

$$
\varepsilon_k-\varepsilon_{k+q}
=
\frac{\hbar^2}{2m}\left(k^2-(k+q)^2\right)
=
-\frac{\hbar^2 q}{m}\left(k+\frac q2\right).
\tag{70}
$$

代入后

$$
\chi_0(q,0)
=
-\frac{m}{\pi\hbar^2 q}
\int dk\, \frac{f_k-f_{k+q}}{k+q/2}.
\tag{71}
$$

现在分析在哪些区间中 $f_k-f_{k+q}\neq 0$。

---

### 7.1 第一段区间

当

$$
k\in[k_F-q,k_F]
\tag{72}
$$

时，$k$ 还在费米海中，但 $k+q$ 已经超出费米海，因此

$$
f_k-f_{k+q}=1.
\tag{73}
$$

---

### 7.2 第二段区间

当

$$
k\in[-k_F-q,-k_F]
\tag{74}
$$

时，$k$ 在费米海外，而 $k+q$ 进入费米海，因此

$$
f_k-f_{k+q}=-1.
\tag{75}
$$

---

### 7.3 其余区间

其余区间内，$f_k$ 与 $f_{k+q}$ 相同，所以差为零。

因此式 (71) 变成

$$
\chi_0(q,0)
=
-\frac{m}{\pi\hbar^2 q}
\int_{k_F-q}^{k_F}\frac{dk}{k+q/2}
+
\frac{m}{\pi\hbar^2 q}
\int_{-k_F-q}^{-k_F}\frac{dk}{k+q/2}.
\tag{76}
$$

分别积分：

$$
\int \frac{dk}{k+q/2} = \ln|k+q/2|.
\tag{77}
$$

于是

$$
\chi_0(q,0)
=
-\frac{m}{\pi\hbar^2 q}
\ln\left|\frac{k_F+q/2}{k_F-q/2}\right|
+
\frac{m}{\pi\hbar^2 q}
\ln\left|\frac{-k_F+q/2}{-k_F-q/2}\right|.
\tag{78}
$$

整理后得到

$$
\boxed{
\chi_0(q,0)
=
-\frac{2m}{\pi\hbar^2 q}
\ln\left|\frac{q+2k_F}{q-2k_F}\right|
}.
\tag{79}
$$

这就是一维静态 Lindhard 函数的标准结果。

---

### 7.4 \(q=2k_F\) 处的奇异性

当 $q\to 2k_F$ 时，

$$
\chi_0(q,0)
\sim
-\frac{m}{\pi\hbar^2 k_F}
\ln\frac{4k_F}{|q-2k_F|}.
\tag{80}
$$

因此在 $q=2k_F$ 处，$\chi_0$ 出现**对数发散**，而且是负发散。

这意味着在该波矢上，电子系统对外加晶格调制的响应极强，从而使声子恢复力受到最大削弱。

---

## 8. 声子软化公式与 Peierls 不稳定

把式 (79) 代入式 (65)：

$$
M\Omega_q^2
=
M\omega_q^2
-
|g_F(q)|^2
\frac{2m}{\pi\hbar^2 q}
\ln\left|\frac{q+2k_F}{q-2k_F}\right|.
\tag{81}
$$

在 $q\to 2k_F$ 附近，

$$
M\Omega_q^2
\sim
M\omega_q^2
-
|g_F(2k_F)|^2
\frac{m}{\pi\hbar^2 k_F}
\ln\frac{4k_F}{|q-2k_F|}.
\tag{82}
$$

由于第二项随 $q\to 2k_F$ 而不断增大，故 $\Omega_q^2$ 会在 $2k_F$ 处被强烈压低，形成声子色散的尖锐凹陷。这就是 **Kohn anomaly**。

若该修正足够强，使得

$$
\Omega_{2k_F}^2\to 0,
\tag{83}
$$

则说明均匀晶格对 $2k_F$ 模不再稳定，系统会自发产生

$$
u_{2k_F}\neq 0,
\tag{84}
$$

即出现静态周期性晶格畸变。这就是 Peierls 不稳定。

---

## 9. Peierls transition 的物理图景总结

整个逻辑链可以概括为：

$$
\text{键长变化}
\;\Rightarrow\;
\text{hopping 变化}
\;\Rightarrow\;
\text{Peierls/SSH 型电子-声子耦合}
\;\Rightarrow\;
\text{电子极化泡修正声子刚度}
\;\Rightarrow\;
q=2k_F \text{ 声子软化}
\;\Rightarrow\;
u_{2k_F}\neq 0
\;\Rightarrow\;
\text{形成 }2k_F\text{ 晶格畸变并打开电子能隙}.
\tag{85}
$$

在半填充时，

$$
2k_F=\frac{\pi}{a},
\tag{86}
$$

所以真实空间中的畸变为交替位移，即二聚化：

$$
u_n=(-1)^n\zeta.
\tag{87}
$$

这时原来的晶格周期 $a$ 翻倍为 $2a$，布里渊区折叠，费米面处开隙，系统总能降低。

---

## 10. 两个需要额外注意的理论点

### 10.1 绝热近似

上面的声子软化推导实际上使用了静态响应函数 $\chi_0(q,0)$。这相当于假设电子能足够快地跟随离子运动，即采用绝热或近绝热极限。

如果真实体系中声子频率不可忽略，则应使用完整的动态响应函数

$$
\chi_0(q,\omega_q),
\tag{88}
$$

此时软化可能减弱，甚至不再表现为严格的临界软模。

---

### 10.2 严格一维与有限温度

严格一维体系在有限温度下有强烈涨落，因此“Peierls 临界温度”的讨论往往需要区分：

1. **均场理论中的临界温标**；
2. **准一维材料在链间耦合作用下形成真正长程序的温度**。

因此在严格数学意义上，最干净的 Peierls 不稳定表述通常是零温极限下的 $2k_F$ 软化与失稳。

---

## 11. 最终核心公式整理

### 11.1 Peierls/SSH 型电子-声子耦合

$$
\boxed{
H_{e\text{-}ph}
=
\frac{1}{\sqrt N}\sum_{k,q,\sigma}
g(k,q)(b_q+b_{-q}^\dagger)c_{k+q,\sigma}^\dagger c_{k,\sigma}
}
\tag{89}
$$

其中

$$
\boxed{
g(k,q)
=
2i\alpha\sqrt{\frac{\hbar}{2M\omega_q}}
\left[\sin((k+q)a)-\sin(ka)\right]
}
\tag{90}
$$

或等价地写成

$$
\boxed{
g(k,q)
=
4i\alpha\sqrt{\frac{\hbar}{2M\omega_q}}
\sin\frac{qa}{2}
\cos\left(ka+\frac{qa}{2}\right)
}
\tag{91}
$$

---

### 11.2 一维静态 Lindhard 函数

$$
\boxed{
\chi_0(q,0)
=
-\frac{2m}{\pi\hbar^2 q}
\ln\left|\frac{q+2k_F}{q-2k_F}\right|
}
\tag{92}
$$

---

### 11.3 重整化后的声子频率

$$
\boxed{
M\Omega_q^2
=
M\omega_q^2 + |g_F(q)|^2\chi_0(q,0)
}
\tag{93}
$$

由于 $\chi_0(q,0)$ 在 $q=2k_F$ 处出现负的对数发散，因此该模式会率先软化：

$$
\boxed{
q=2k_F \text{ 是 Peierls transition 的不稳定波矢}
}
\tag{94}
$$

---

## 12. 参考文献

### 原始与经典文献

1. W. P. Su, J. R. Schrieffer, and A. J. Heeger,  
   *Solitons in Polyacetylene*,  
   Phys. Rev. Lett. **42**, 1698 (1979).

### 课程讲义与综述

2. UCSD Physics 239 课程讲义，关于 SSH 模型、键长调制 hopping 与二聚化。  
3. M. Berciu, 关于 electron-phonon interaction 的课程笔记，讨论 Peierls/SSH 型耦合与 $2k_F$ anomaly。  
4. CFM/EHU 关于低维电子系统 response function 的讲义，给出一维 Lindhard 函数与 phonon instability 的标准推导。  
5. J.-P. Pouget,  
   *The Peierls instability and charge density wave in one-dimensional electronic conductors*,  
   Comptes Rendus Physique **17**, 332–356 (2016).

---

## 13. 一句话总结

Peierls transition 的本质是：一维电子系统通过 Peierls/SSH 型电子-声子耦合，把波矢为 $2k_F$ 的晶格调制与费米面两侧电子态强烈耦合；由于一维静态电子响应函数在 $q=2k_F$ 处出现对数奇异，导致该声子模式的恢复力被显著削弱，最终发生声子软化、静态二聚化和费米能隙打开。