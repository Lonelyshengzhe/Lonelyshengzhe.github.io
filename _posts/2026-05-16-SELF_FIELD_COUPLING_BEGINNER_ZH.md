---
title: "Self-Field Couple workflow"
date: 2026-05-16 10:00:00 +0800
tags: [exciton, code]
---
# 当前 self-field coupling 的初学者说明

本文只解释当前 `photons.py` 和 `stack_optics.py` 里实际采用的 self-field coupling 路径。目标是从零开始说明代码在做什么、每一步为什么需要、为什么函数最后返回的是 `E/J`。

相关代码位置：

- `photons.py` 的主计算入口：`calculate_photon_matrix(...)`
- `photons.py` 的逐动量计算：`_compute_hbar_gamma_k_resolved(...)`
- `stack_optics.py` 的 RCWA 光学环境计算：`env_factor_rcwa(...)`
- `stack_optics.py` 的动量谐波匹配：`match_k_to_rcwa_order_1d(...)`
- `stack_optics.py` 的 self-field coupling：`compute_self_field_e_over_j_from_details(...)`
- `stack_optics.py` 的 `E/J` 到非负辐射率 proxy 转换：`compute_k_resolved_hbar_gamma_from_self_field(...)`

## 1. 一句话版本

当前代码把一个动量为 `K` 的激子看成位于材料叠层内部的二维切向电流片。这个电流片会向上、向下发射电磁波；波遇到顶部光栅和底部多层膜后会反射回来。代码用 RCWA 给出的顶部复反射振幅、TMM 给出的底部复反射振幅，以及传播相位，构造电流片在自身位置感受到的自场。由于麦克斯韦方程在这里按线性响应处理，自场和源电流成正比，所以代码计算的是比例系数 `E/J`，而不是某个具体绝对电场 `E`。

数学上，它想要的是：

$$
E_{\mathrm{self},K}
=
\left(\frac{E}{J}\right)_K
J_K
$$

这里：

- `K` 是激子的面内动量，单位是 `nm^-1`。
- `J_K` 是该动量谐波的二维电流片幅度。
- `E_self,K` 是同一个动量谐波在电流片位置产生的自场。
- `E/J` 是电场对电流的线性响应系数。在真实 SI 单位里，它类似阻抗；在当前代码里，它是经过归一化和任意 scale 处理后的 impedance-like proxy。

## 2. 当前默认路径在哪里

`photons.py` 现在的 `calculate_photon_matrix(...)` 不再走旧的单纯 stack factor 路径，而是直接调用 `_compute_hbar_gamma_k_resolved(...)`。

逐个动量 bin 的核心流程是：

1. 对每个动量中心 `ki`，计算激子能量 `Ei`。
2. 调用 `env_factor_rcwa(...)`，得到折叠后的光学通道、RCWA 顶部反射振幅、TMM 底部反射振幅等信息。
3. 对同一个动量 bin 计算一个 homogeneous photon DOS 积分 `I`。
4. 如果折叠后仍在发射介质光锥外，则该 bin 的 `hbar_gamma[i]` 设为零。
5. 如果需要的 RCWA 衍射级次没有被当前 `n_harmonics` 包含，也设为零。
6. 调用 `compute_self_field_e_over_j_from_details(...)` 得到 `e_over_j`。
7. 调用 `compute_k_resolved_hbar_gamma_from_self_field(...)` 把 `e_over_j` 变成非负 overlap factor。
8. 用这个 factor 乘上 homogeneous DOS 积分，再除以 bin 面积 `Abin[i]`。
9. 如果没有关闭 calibration，则把整条曲线按热平均缩放到目标 `hbar_gamma_rad0`。

对应的最终 bin 公式是：

$$
\hbar\gamma_i
=
\mathrm{overlap}_i
\frac{I_i}{A_{\mathrm{bin},i}}
$$

这里：

- `hbar_gamma[i]` 是代码输出的第 `i` 个动量 bin 的辐射率能量宽度，单位按项目约定是 `meV`。
- `overlap_i` 来自 self-field coupling。
- `I_i` 是 `integrate_hbar_gamma_rad(...)` 返回的 homogeneous photon DOS 积分。
- `Abin[i]` 是二维动量空间中该 ring bin 的面积。

需要注意：`E/J` 本身不是最后的 `hbar_gamma`。它先被转成一个非负 overlap proxy，然后再和原有 photon DOS 积分结合。

## 2.1 当前 stack layer / grating 参数总览（在哪里设，当前是多少）

这一节只回答一个实操问题：**当前代码到底在用哪组几何和光栅参数**。

### 2.1.1 第一层来源：`stack_optics.py` 的全局默认

`stack_optics.py` 里有两个 dataclass 是“默认参数源头”：

- `StackLayerConfig`（`DEFAULT_STACK_CONFIG`）  
  - `d_top_hbn_nm = 5.0`
  - `d_bot_hbn_nm = 10.0`
  - `d_sio2_nm = 10.0`
  - `d_tmd_nm = 20.0`
- `GratingRCWAConfig`（`DEFAULT_RCWA_CONFIG`）  
  - `enabled = True`
  - `period_nm = 220.0`
  - `fill_factor = 0.5`
  - `etch_depth_nm = 6.0`
  - `n_harmonics = 11`
  - `nx = 401`
  - `azimuth_phi_rad = 0.0`
  - `silent_progress = True`

### 2.1.2 第二层来源：`photons.py` 在主路径里如何覆盖

当前 self-field 主路径是 `calculate_photon_matrix(...) -> _compute_hbar_gamma_k_resolved(...)`。在这条路径中：

- layer 厚度参数来自 `parse_photon_cli_args(...)` 的 CLI 默认值；这些默认值又取自 `DEFAULT_STACK_CONFIG`。
- `bottom_material` 的默认是 `si`（可通过 `--bottom-material` 选 `ag`）。
- RCWA 配置在运行时构造成  
  `GratingRCWAConfig(enabled=True, period_nm=..., n_harmonics=...)`。  
  也就是说，CLI 直接暴露的是 `period_nm` 和 `n_harmonics`；`fill_factor`、`etch_depth_nm`、`nx`、`azimuth_phi_rad`、`silent_progress` 沿用 `GratingRCWAConfig()` 默认值。
- `env_factor_rcwa(...)` 虽然函数签名里 `d_sio2_nm` 默认写的是 `285.0`，但 `photons.py` 当前路径会显式传入 `d_sio2_nm`（默认 `10.0`），所以主路径实际不是 `285.0`。

### 2.1.3 第三层：不加 CLI 参数时“当前生效值”

如果直接运行 `python photons.py` 且不额外传几何/光栅参数，当前生效的是：

- stack layer:
  - `d_top_hbn_nm = 5.0`
  - `d_bot_hbn_nm = 10.0`
  - `d_sio2_nm = 10.0`
  - `d_tmd_nm = 20.0`（用于 `env_factor_rcwa` 里的 `d_TMD_nm`）
  - `d_sheet_nm = 20.0`（用于 self-field 里的 `exp(2 i kz d_sheet)`）
  - `bottom_material = "si"`
  - 底部 planar TMM 层序（由 `n_list_bot`, `d_list_bot` 定义）是  
    `n_emit (半无限) / hBN(d_bot_hbn) / SiO2(d_sio2) / bottom(半无限)`。
- grating:
  - `enabled = True`
  - `period_nm = 220.0`
  - `n_harmonics = 11`
  - `fill_factor = 0.5`
  - `etch_depth_nm = 6.0`
  - `nx = 401`
  - `azimuth_phi_rad = 0.0`

### 2.1.4 一个容易忽略但很关键的实现细节

在 `_compute_rt_top_rcwa(...)` 中，实际参与 RCWA 几何时会做：

- `etch_depth_nm` 被夹到 `[0, d_top_hbn_nm]` 范围；
- 剩余 slab 厚度是 `d_top_hbn_nm - etch_depth_nm`。

因此在当前默认值下（`d_top_hbn_nm=5.0`, `etch_depth_nm=6.0`），实际生效是：

- `etch_depth_effective = 5.0 nm`
- `slab_effective = 0.0 nm`

即默认参数对应“顶部 hBN 层被完全刻穿到该层厚度上限”的几何。
对应的顶部 RCWA 层序是：入射侧 `n_emit` ->（可选）未刻蚀 hBN slab -> hBN/air 矩形光栅层 -> 出射侧 air。

### 2.1.5 `d_TMD_nm` 和 `d_sheet_nm` 目前是否联动

当前代码里两者默认都来自 `DEFAULT_STACK_CONFIG.d_tmd_nm = 20.0`，数值相同；但来源和用途不同：

- `d_TMD_nm`：传给 `env_factor_rcwa(...)`，进入旧的 stack-factor 干涉项（`phase = exp(i kz d_TMD)`）。
- `d_sheet_nm`：传给 `compute_self_field_e_over_j_from_details(...)`，进入 self-field 反馈相位（`phase2 = exp(2 i kz d_sheet)`）。

另外，`_compute_hbar_gamma_k_resolved(...)` 当前对 `env_factor_rcwa(...)` 传的是 `d_TMD_nm=DEFAULT_STACK_CONFIG.d_tmd_nm`（固定默认源），而 self-field 这边使用的是函数参数 `d_sheet_nm`（可被 `--d-sheet-nm` 改动）。因此当你只改 `--d-sheet-nm` 时，这两条相位长度在实现上可能不再一致。

### 2.1.6 grating 参数逐项说明（物理含义 + 代码生效方式）

下面按 `GratingRCWAConfig` 的字段逐项说明当前实现。

- `enabled`  
  - 含义：是否启用光栅动量折叠搜索（`m` 阶通道搜索）。  
  - 当前默认：`True`。  
  - 生效方式：在 `env_factor_rcwa(...)` 中，`enabled=True` 时会根据 `n_harmonics` 扩展候选 `m`；`enabled=False` 时只用 `m=0`（更接近平面层模型）。

- `period_nm`  
  - 含义：光栅周期 `period`（单位 `nm`）。  
  - 当前默认：`220.0`。  
  - 生效方式：  
    1) 决定倒格矢 `G = 2π/period`，直接影响 `K = k_parallel + mG` 匹配；  
    2) 在 RCWA 几何中作为 `RectangularGrating(period=...)` 的周期。  
  - 调参直觉：减小周期会增大 `G`，同一 `K` 需要的匹配阶数会变化，可能改变哪些通道可辐射。

- `fill_factor`  
  - 含义：占空比（高折射率“脊”宽度相对周期的比例）。  
  - 当前默认：`0.5`。  
  - 生效方式：代码里传给 `RectangularGrating` 的不是 fill 本身，而是  
    `groove_width = (1 - fill_factor) * period`，即“低折射率沟槽宽度”。  
    所以当前默认 `fill_factor=0.5` 等价于脊和槽各占一半。  
  - 调参直觉：它控制横向折射率调制的几何形状，通常会影响衍射耦合强弱和各阶能量分配。

- `etch_depth_nm`  
  - 含义：刻蚀深度（光栅层厚度目标值）。  
  - 当前默认：`6.0`。  
  - 生效方式：会被限制在 `[0, d_top_hbn_nm]`；实际 RCWA 光栅厚度是 `etch_um`，剩余未刻蚀 slab 是 `d_top_hbn_nm - etch_um`。  
  - 当前默认组合下：`d_top_hbn_nm=5.0`，因此有效刻蚀深度变成 `5.0`，剩余 slab 为 `0.0`。

- `n_harmonics`  
  - 含义：RCWA 谐波数（截断阶数）。  
  - 当前默认：`11`。  
  - 生效方式：内部会强制归一化为正奇数（偶数会自动加 1）；并用于 `Solver(..., n_harmonics)`。  
  - 对主流程的额外影响：在 `enabled=True` 时，它也决定 `m` 候选搜索范围；太小会导致某些 `fold_order` 不在 `orders_m` 中，代码会把对应 bin 置零并提示“Increase --n-harmonics”。

- `nx`  
  - 含义：光栅横向离散采样点数。  
  - 当前默认：`401`。  
  - 生效方式：传入 `RectangularGrating(nx=...)`，且代码保证最小不低于 `51`。  
  - 调参直觉：更大 `nx` 往往提高几何表示精度，但计算更慢。

- `azimuth_phi_rad`  
  - 含义：方位角 `phi`（入射平面相对光栅方向）。  
  - 当前默认：`0.0`。  
  - 生效方式：传入 `Source(phi=...)`。当前文档和代码注释均按 1D 光栅、`phi=0` 的典型场景解释，若改为非零，需要重新核对偏振分量选择与物理解释。

- `silent_progress`  
  - 含义：是否静默 RCWA 进度输出。  
  - 当前默认：`True`。  
  - 生效方式：`True` 时会重定向 stdout/stderr 并屏蔽进度条；只影响输出噪声，不改变物理计算结果。

### 2.1.7 当前 CLI 能直接改哪些 grating 参数

`photons.py` 当前命令行直接开放的是：

- `--period-nm`
- `--n-harmonics`

其余 grating 参数（`fill_factor`、`etch_depth_nm`、`nx`、`azimuth_phi_rad`、`silent_progress`）当前主脚本没有单独 CLI 开关，默认沿用 `GratingRCWAConfig()`，除非你在代码里显式构造并传入自定义 `rcwa_config`。

## 3. 为什么需要 RCWA 的谐波匹配

顶部结构是周期光栅，因此面内连续平移对称性被打破。光栅可以给光场提供整数倍的倒格矢。代码使用一维光栅，所以倒格矢大小是：

$$
G
=
\frac{2\pi}{\mathrm{period}}
$$

这里：

- `period` 是光栅周期，对应代码里的 `period_nm`，单位 `nm`。
- `G` 的单位是 `nm^-1`。

周期结构中的 RCWA 场不是只有一个面内动量，而是一组衍射谐波：

$$
q_m
=
k_{\parallel}
+mG
$$

这里：

- `m` 是 RCWA 衍射级次，是整数，例如 `-2, -1, 0, 1, 2`。
- `k_parallel` 是折叠到第一布里渊区附近的 Bloch 面内动量。
- `q_m` 是第 `m` 个谐波真正携带的物理面内动量。

激子电流片有自己的面内动量 `K`。只有满足下面条件的光场谐波能和该激子电流谐波相干重叠：

$$
K
=
k_{\parallel}
+mG
$$

所以，`compute_self_field_e_over_j_from_details(...)` 的第一件关键事情不是算电场，而是找出哪个 RCWA order 对应当前激子的 `K`。

当前代码的细节是：

1. `photons.py` 把动量 bin 中心 `ki` 当作 `K_nm_inv` 传入。
2. `env_factor_rcwa(...)` 先尝试用整数 `m` 把原始 `K` 折叠成更小的 `k_bloch`。
3. `env_factor_rcwa(...)` 把选中的 `m` 存成 `fold_order`。
4. `compute_self_field_e_over_j_from_details(...)` 再用 `fold_order` 和 `orders_m` 找到 RCWA 数组中的 index。
5. 如果 `strict_match=True` 且 mismatch 超过 `match_tol`，代码会报错；否则会使用最接近的 order。

匹配误差的概念是：

$$
\Delta K
=
\left|
K
-
\left(k_{\parallel}+mG\right)
\right|
$$

这里 `Delta K` 对应代码里的 `mismatch_nm_inv`。

## 4. `env_factor_rcwa(...)` 准备了什么信息

`env_factor_rcwa(...)` 做的是“给定能量和面内动量，计算这个 stack 中相关的光学通道”。它返回的 `details` 会被 self-field coupling 使用。

### 4.1 能量到波长

代码先把激子能量 `E_meV` 转成真空波长：

$$
\lambda
=
\frac{hc}{E}
$$

在代码单位里，`E` 用 `meV`，`lambda` 用 `nm`。

### 4.2 发射介质折射率

如果没有手动传入 `n_emit_override`，代码把 hBN 的实部折射率作为发射介质折射率：

$$
n_{\mathrm{emit}}
=
\operatorname{Re}
\left(n_{\mathrm{hBN}}\right)
$$

这个 `n_emit` 会影响光锥、传播角、`kz` 和 homogeneous photon DOS 积分。

### 4.3 真空波数和介质中的总波数

代码定义：

$$
k_0
=
\frac{2\pi}{\lambda}
$$

介质中的光波总波数大小近似是：

$$
n_{\mathrm{emit}}k_0
$$

### 4.4 折叠后的面内动量和 `kz`

对每个候选 order，代码计算：

$$
k_{\mathrm{Bloch}}
=
K
-mG
$$

并选择使 `abs(k_Bloch)` 最小、因此最容易落入光锥的 order。折叠后的面内动量大小是：

$$
k_{\mathrm{eff}}
=
\left|k_{\mathrm{Bloch}}\right|
$$

然后计算发射介质中的纵向波矢：

$$
k_z
=
\sqrt{
\left(n_{\mathrm{emit}}k_0\right)^2
-
k_{\mathrm{eff}}^2
}
$$

如果折叠后仍不满足传播条件，代码标记 `outside_emit_lightcone=True`，`photons.py` 会把该动量 bin 的辐射率设为零。

传播条件是：

$$
\frac{k_{\mathrm{eff}}}{n_{\mathrm{emit}}k_0}
<
1
$$

### 4.5 底部反射

底部结构当前用 planar TMM 处理。代码分别对 s 和 p 偏振计算底部复反射振幅：

$$
r_{\mathrm{bot},s}
$$

$$
r_{\mathrm{bot},p}
$$

这些是复数，包含反射强度和相位。

### 4.6 顶部光栅反射

顶部结构用 RCWA 处理。代码分别跑 s-like 和 p-like 入射，得到每个衍射级次的复反射振幅数组：

$$
r_{\mathrm{top},s}(m)
$$

$$
r_{\mathrm{top},p}(m)
$$

self-field coupling 后面不会只使用总反射率，而是会取出与当前 `K` 匹配的那个 order 的复振幅。

## 5. self-field coupling 的核心模型

`compute_self_field_e_over_j_from_details(...)` 的模型可以按下面几步理解。

### 5.1 选出匹配的顶部反射振幅

匹配得到 order index 后，代码取：

$$
r_{\mathrm{top},s}
=
r_{\mathrm{top},s}(m_{\mathrm{match}})
$$

$$
r_{\mathrm{top},p}
=
r_{\mathrm{top},p}(m_{\mathrm{match}})
$$

这里：

- `m_match` 是满足 `K = k_parallel + mG` 的 RCWA order。
- `r_top_s` 是 s 偏振对应 order 的顶部复反射振幅。
- `r_top_p` 是 p 偏振对应 order 的顶部复反射振幅。

底部反射振幅来自 TMM：

$$
r_{\mathrm{bot},s}
$$

$$
r_{\mathrm{bot},p}
$$

### 5.2 计算往返相位

代码定义：

$$
\phi_2
=
\exp
\left(
2ik_zd_{\mathrm{sheet}}
\right)
$$

对应代码变量是 `phase2`。

这里：

- `kz` 是发射介质中的纵向波矢。
- `d_sheet_nm` 是代码中用于相位反馈的距离参数，默认来自 `DEFAULT_STACK_CONFIG.d_tmd_nm`，当前是 `20.0 nm`。
- 因为指数里有 `2`，它表示一次向下或向上再返回的 round-trip-like 相位。

我不能仅凭这两个文件确定 `d_sheet_nm` 在物理几何中到底代表“电流片到哪个反射面”的精确距离，还是一个 reduced cavity 模型里的有效距离。代码只显示它作为反馈相位长度使用。

### 5.3 用几何级数表示多次反射反馈

一个电流片会向上和向下发射波。波在顶部和底部之间反复反射。每完整往返一次，会乘上：

$$
r_{\mathrm{top}}
r_{\mathrm{bot}}
\phi_2
$$

多次往返的总和是一个几何级数：

$$
1
+
r_{\mathrm{top}}r_{\mathrm{bot}}\phi_2
+
\left(r_{\mathrm{top}}r_{\mathrm{bot}}\phi_2\right)^2
+
\cdots
=
\frac{1}{
1-r_{\mathrm{top}}r_{\mathrm{bot}}\phi_2
}
$$

所以代码里出现了 denominator：

$$
D_s
=
1-r_{\mathrm{top},s}r_{\mathrm{bot},s}\phi_2
$$

$$
D_p
=
1-r_{\mathrm{top},p}r_{\mathrm{bot},p}\phi_2
$$

如果 denominator 太接近零，代码会加一个很小的 `EPS`，避免数值除零。

### 5.4 上行和下行局域场增强

代码定义 s 偏振的上行反馈幅度：

$$
a_{\mathrm{up},s}
=
\frac{
1+r_{\mathrm{bot},s}\phi_2
}{
1-r_{\mathrm{top},s}r_{\mathrm{bot},s}\phi_2
}
$$

p 偏振类似：

$$
a_{\mathrm{up},p}
=
\frac{
1+r_{\mathrm{bot},p}\phi_2
}{
1-r_{\mathrm{top},p}r_{\mathrm{bot},p}\phi_2
}
$$

直观解释：

- 分母是顶部和底部之间多次反射的无限反馈。
- 分子里的 `1` 是源直接向上发射的部分。
- 分子里的 `r_bot * phase2` 是先向下、经底部反射后回到上行方向的部分。

代码还定义下行幅度：

$$
a_{\mathrm{dn},s}
=
1+r_{\mathrm{top},s}a_{\mathrm{up},s}
$$

$$
a_{\mathrm{dn},p}
=
1+r_{\mathrm{top},p}a_{\mathrm{up},p}
$$

直观解释：

- `1` 是源直接向下发射的部分。
- `r_top * a_up` 是上行波被顶部反射后回到下行方向的部分。

然后局域场增强因子是上行和下行在电流片位置的和：

$$
L_s
=
a_{\mathrm{up},s}
+
a_{\mathrm{dn},s}
$$

$$
L_p
=
a_{\mathrm{up},p}
+
a_{\mathrm{dn},p}
$$

代码变量名是 `local_enh_s` 和 `local_enh_p`。

## 6. 从局域场增强到 `E/J`

局域场增强 `L_s` 和 `L_p` 还不是 `E/J`。它只表示由于顶部和底部反射，单位源发出的场被增强或削弱了多少。要得到电流片产生的切向电场，还需要一个“电流片源强到电场”的因子。

在最简单的均匀介质问题中，一个切向电流片向两侧发射，片上的切向场和片电流之间会出现类似：

$$
\frac{E}{J}
\sim
-\frac{Z}{2}
$$

这里：

- `Z` 是介质和偏振相关的波阻抗。
- `1/2` 来自电流片向两侧发射的边界条件结构。
- 负号来自代码采用的功率符号约定：辐射出去的功率用 `-Re[J*E]` 表示为正。

当前代码没有使用真实 SI 波阻抗，而是使用归一化的角度因子：

$$
Z_{\mathrm{TE,code}}
=
\frac{1}{\cos\theta}
$$

$$
Z_{\mathrm{TM,code}}
=
\cos\theta
$$

其中：

$$
\cos\theta
=
\frac{k_z}{n_{\mathrm{emit}}k_0}
$$

代码实际用了 `abs(cos_theta)` 并设置最小值 `1e-6`，以避免 grazing angle 附近数值发散。这是一个数值和模型简化；它不是完整的复数阻抗处理。

于是 s 偏振的 self-field coupling 是：

$$
\left(\frac{E}{J}\right)_s
=
-\frac{1}{2}
s_Z
Z_{\mathrm{TE,code}}
L_s
$$

p 偏振的 self-field coupling 是：

$$
\left(\frac{E}{J}\right)_p
=
-\frac{1}{2}
s_Z
Z_{\mathrm{TM,code}}
L_p
$$

这里 `s_Z` 对应代码里的 `impedance_scale_arb`。默认值是 `1.0`。

如果 `polarization="avg"`，代码返回二者平均：

$$
\left(\frac{E}{J}\right)_{\mathrm{avg}}
=
\frac{1}{2}
\left[
\left(\frac{E}{J}\right)_s
+
\left(\frac{E}{J}\right)_p
\right]
$$

当前 `photons.py` 调用时使用的就是 `polarization="avg"`。

## 7. 为什么得到的是 `E/J`

这是最容易混淆的点。代码里没有显式传入一个真实的 `J` 数值，因为它不是在计算某个特定强度下的绝对场，而是在计算线性响应系数。

线性电磁问题满足：

$$
J_K
\rightarrow
E_{\mathrm{self},K}
$$

如果把源电流放大 `alpha` 倍，电场也放大 `alpha` 倍：

$$
\alpha J_K
\rightarrow
\alpha E_{\mathrm{self},K}
$$

因此一定可以写成：

$$
E_{\mathrm{self},K}
=
G_K J_K
$$

这里 `G_K` 就是代码命名里的 `E/J`：

$$
G_K
=
\left(\frac{E}{J}\right)_K
$$

当前函数通过“单位电流片源”的方式直接构造 `G_K`。也就是说，代码相当于令：

$$
J_K
=
1
$$

那么：

$$
E_{\mathrm{self},K}
=
\left(\frac{E}{J}\right)_K
$$

这就是为什么函数名叫 `compute_self_field_e_over_j_from_details`，返回变量叫 `e_over_j`。

如果以后你想把它改成某个具体激子极化 `P` 的场，也要先用电流和极化的关系：

$$
J_K
=
-i\omega P_K
$$

因此：

$$
E_{\mathrm{self},K}
=
\left(\frac{E}{J}\right)_K
\left(-i\omega P_K\right)
$$

也就是说：

$$
\left(\frac{E}{P}\right)_K
=
-i\omega
\left(\frac{E}{J}\right)_K
$$

## 8. 为什么 `E/J` 能给辐射率 proxy

电流对电磁场做功的时间平均功率形式是：

$$
P_{\mathrm{rad}}
\sim
-\frac{1}{2}
\operatorname{Re}
\left[
J^*
E
\right]
$$

把线性响应关系代入：

$$
E
=
\left(\frac{E}{J}\right)J
$$

得到：

$$
P_{\mathrm{rad}}
\sim
-\frac{1}{2}
\operatorname{Re}
\left[
J^*
\left(\frac{E}{J}\right)
J
\right]
$$

因为：

$$
J^*J
=
\left|J\right|^2
$$

所以：

$$
P_{\mathrm{rad}}
\sim
-\frac{1}{2}
\operatorname{Re}
\left[
\frac{E}{J}
\right]
\left|J\right|^2
$$

因此，在单位源强或只关心相对 coupling 的情况下，决定辐射功率正负和大小的核心量是：

$$
-
\operatorname{Re}
\left[
\frac{E}{J}
\right]
$$

这正是代码在 `compute_k_resolved_hbar_gamma_from_self_field(...)` 中做的事情：

$$
\mathrm{overlap}
=
\max
\left(
-
s_{\gamma}
\operatorname{Re}
\left[
\frac{E}{J}
\right],
0
\right)
$$

这里：

- `s_gamma` 是 `gamma_scale_arb`，默认 `1.0`。
- `max(..., 0)` 保证输出的 proxy 非负。
- 如果 `Re[E/J]` 为负，则 `-Re[E/J]` 为正，对应电流向外辐射能量。
- 如果 `Re[E/J]` 为正，则这个简单 proxy 会给负辐射功率，代码把它截断为零。

## 9. 这是不是完整的 self-consistent RCWA

不是。

当前实现更准确的说法是：source-driven self-field proxy 或 reduced cavity feedback closure。

它做到了：

- 把激子看作切向电流片。
- 用 `K = k_parallel + mG` 做动量谐波匹配。
- 使用匹配 order 的顶部 RCWA 复反射振幅。
- 使用底部 TMM 复反射振幅。
- 使用 round-trip 相位构造多次反射反馈。
- 返回一个复数 `E/J`，再通过功率公式取 `-Re[E/J]`。

它没有做到，至少从这两个文件看不到：

- 没有把激子电流片作为显式 impressed current source 放进 RCWA 求解器直接求场。
- 没有从 RCWA 求解器里直接读取“由该电流片产生的完整 self-field”。
- 没有完整处理 SI 单位下的绝对电流、真实波阻抗、偶极矩和面积归一化。
- 最后绝对量级仍通过 `calibrate_target_hbar_gamma` 热平均校准到 `hbar_gamma_rad0`。

所以，如果你问“它是不是物理上严格的自发辐射 Green function 计算”，仅凭当前代码我会回答：不是完整严格版本，而是一个包含动量匹配、复反射相位和 cavity feedback 的中间模型。

## 10. 常见疑问

### 10.1 为什么 self-field 使用反射振幅，不直接使用 transmission

因为这里想要的是电流片在自己位置感受到的自场。局域自场主要由源发出的波和从上下界面返回的波叠加决定，所以需要复反射振幅及其相位。Transmission 更适合描述向外出射了多少能量，但不能单独给出片上自场相位反馈。

### 10.2 为什么 `env_factor_rcwa(...)` 还计算 `F`

`env_factor_rcwa(...)` 同时保留了旧的 stack factor 逻辑，会计算 `F`、`Ts_up`、`Tp_up` 等量。但在当前 `photons.py` 的 self-field 路径里，真正传给 `compute_self_field_e_over_j_from_details(...)` 使用的是 `details` 里的复反射、order、`kz`、`n_emit` 等信息。`photons.py` 对返回的 `F` 用 `_` 接住，说明当前主路径并不直接使用这个 `F`。

### 10.3 为什么还要乘 homogeneous photon DOS 积分

当前代码没有把 self-field coupling 本身当作完整的绝对辐射率。它把 self-field coupling 当作一个 stack-dependent overlap factor，然后仍然乘上已有的 homogeneous photon DOS bin integral：

$$
\hbar\gamma_i
=
\mathrm{overlap}_i
\frac{I_i}{A_{\mathrm{bin},i}}
$$

这保留了原项目的动量 bin、能量 delta 函数积分和最终动力学接口。

### 10.4 `E/J` 的单位是什么

物理 SI 单位里，如果 `J` 是二维 sheet current density，`E/J` 类似欧姆。可是当前代码里的 `z_te`、`z_tm` 没有乘真空阻抗，也没有显式带入真实电流片单位；`impedance_scale_arb` 默认也是任意 scale。因此当前返回的 `E/J` 更应理解为 normalized impedance-like coupling，不应直接解释为 SI 绝对阻抗。

最后通过热平均 calibration：

$$
\left\langle
\hbar\gamma
\right\rangle_T
\rightarrow
\hbar\gamma_{\mathrm{rad0}}
$$

这一步把相对曲线缩放到项目设定的目标平均辐射宽度。

### 10.5 `d_sheet_nm` 到底是什么

代码明确显示它进入：

$$
\phi_2
=
\exp
\left(
2ik_zd_{\mathrm{sheet}}
\right)
$$

但仅凭 `photons.py` 和 `stack_optics.py`，我不能确定它在实验结构中精确对应哪两个位置之间的距离。当前默认值来自 `DEFAULT_STACK_CONFIG.d_tmd_nm`，即 `20.0 nm`。如果你希望我进一步确认它是否应代表 TMD 厚度、sheet 到某个反射边界的距离，或 effective cavity length，需要结合几何定义、图示或原始推导再核对。

## 11. 最小 mental model

对每个动量 `K`，你可以按下面顺序记住当前算法：

1. 激子是一个二维电流片谐波 `J_K`。
2. 光栅允许动量差一个整数倍 `G`。
3. 找到满足 `K = k_parallel + mG` 的 RCWA order。
4. 取这个 order 的顶部复反射振幅。
5. 取底部 planar stack 的复反射振幅。
6. 用 `exp(2 i kz d_sheet)` 给上下往返波加相位。
7. 用几何级数求多次反射后的局域场增强。
8. 用电流片边界条件的 normalized impedance-like 因子把局域场增强变成 `E/J`。
9. 用 `-Re[E/J]` 得到非负 overlap proxy。
10. 把这个 proxy 乘到原来的 photon DOS bin integral 上，得到 `hbar_gamma(k)`。

## 12. 我不能从当前两个文件确定的事项

以下问题当前文件没有给出足够信息，我不会把它们说成确定事实：

- `d_sheet_nm` 的精确几何含义。
- `impedance_scale_arb` 如果要变成 SI 绝对单位，应该乘哪个完整阻抗和面积归一化因子。
- RCWA package 返回的 `rx/ry/tx/ty` 振幅在所有偏振和 order 上的严格归一化约定。
- 当前 `avg` 偏振平均是否最适合具体 TMD 激子偶极方向。
- 把 `cos_theta` 改成 `abs(cos_theta)` 是否在所有接近光锥边缘或复角情况下都物理合适。

