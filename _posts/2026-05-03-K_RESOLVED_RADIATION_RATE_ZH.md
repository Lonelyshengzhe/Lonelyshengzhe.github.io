---
title: "K-resolved rad"
date: 2026-05-03 10:00:00 +0800
tags: [exciton, code]
---
# K 分辨辐射率工作文档（详细中文版）

日期：2026-05-03  
项目：`ExcitonPhoton interactions (Johanna, Shengze)`  
目标分支：`stack_cs`  
推荐运行环境：`conda activate exciton-env`

## 1. 文档目的

本文档说明当前新增的 **K 分辨（K-resolved）辐射率计算路径**：它从 `current_sheet_stack.md` 中的二维激子电流片思想出发，在已有 stack 光学流程的基础上，引入 RCWA 衍射级次的动量匹配，从而让周期结构中的辐射率计算更明确地依赖激子面内动量 `K` 与光学谐波通道之间的关系。

这份文档比原始英文工作记录更详细，重点回答以下问题：

- 为什么需要 K 分辨路径。
- 它与原有 `F_stack(k) * gamma_homogeneous(k)` 路径有什么关系。
- 当前代码实际新增了哪些接口。
- 现阶段模型采用了哪些近似。
- 如何运行、验证和继续改进。

## 2. 背景：原有 stack 辐射率路径

在本项目中，动力学代码需要的是每个动量 bin 上的 `hbar*gamma_rad(k)`，单位为 meV。后续在 EOM 中会除以 `hbar`，转换成类似 `ps^-1` 的衰减率。

原有 stack 路径可以概括为：

```text
hbar_gamma_stack(k)
    = F_stack(E(k), k) * I_homogeneous(k; n_emit) / Abin(k)
```

其中：

- `F_stack(E, k)` 是多层结构或光栅结构对辐射通道的环境修正因子。
- `I_homogeneous(k; n_emit)` 是 `photons.py` 中基于 photon density of states 和 broadened delta function 的均匀介质积分。
- `Abin(k)` 是二维动量空间环形 bin 面积。
- `n_emit` 通常取发射层附近 hBN 的实部折射率。

当前主流程大致为：

```text
photons.py
  -> compute_stack_arrays()
  -> stack_optics.precompute_Fk()
  -> stack_optics.env_factor_rcwa() 或 stack_optics.env_factor_tmm()
  -> calculate_photon_matrix()
  -> timestepping.py / self_consistent_gamma.py
```

这个路径的优点是与已有动力学代码兼容，且已有热平均、动量网格和归一化逻辑可以继续复用。它的不足是：对周期结构而言，`F_stack` 内部可能已经做了 grating folding，但 homogeneous DOS 积分本身仍然按原始 exciton momentum bin 做，RCWA 的衍射级次与激子 `K` 的匹配关系不够显式。

## 3. K 分辨路径要解决的问题

周期结构中，RCWA 电场可写成面内谐波展开：

```text
E(rho, z_ex; omega)
  = sum_G E_G(z_ex; omega) * exp[i (k_parallel + G) · rho]
```

激子电流片的一个动量分量为：

```text
j_K(rho, z; omega)
  = -i omega P_K exp[i K · rho] delta(z - z_ex)
```

将二者做面内重叠积分时，会得到动量选择规则：

```text
K = k_parallel + G
```

对一维光栅，倒格矢可以写成：

```text
G_m = m * 2*pi / period
```

因此实际匹配关系是：

```text
K = k_parallel + mG
```

K 分辨路径的核心目标，就是对每个激子动量 bin center `K_i`，明确找出 RCWA 中满足上述关系的衍射级次 `m`，然后使用这个匹配级次对应的通道权重来构造 stack-dependent overlap factor。

## 4. 当前实现概览

本次更新主要涉及两个文件：

- `stack_optics.py`
- `photons.py`

同时新增单元测试：

- `tests/test_k_resolved_stack_optics.py`

### 4.1 `stack_optics.py` 中新增的 K 分辨工具

新增数据结构：

```text
KHarmonicMatch1D
```

它记录一次一维光栅动量匹配的结果，包括：

- `K_nm_inv`：目标激子面内动量，单位 `nm^-1`。
- `k_parallel_nm_inv`：RCWA Bloch 或 folded channel 的面内动量。
- `reciprocal_G_nm_inv`：光栅倒格矢大小 `G = 2*pi/period_nm`。
- `order_m`：匹配到的衍射级次。
- `q_matched_nm_inv`：该级次的物理面内动量 `k_parallel + mG`。
- `mismatch_nm_inv`：与目标 `K` 的残差。
- `index`：该级次在 `orders_m` 数组中的索引。

新增函数：

```text
match_k_to_rcwa_order_1d(...)
```

功能：

1. 根据 `period_nm` 计算 `G`。
2. 对所有可用的 `orders_m` 计算 `q_m = k_parallel + mG`。
3. 找到与目标 `K` 最近的衍射级次。
4. 如果启用 `strict=True`，并且 mismatch 超过 `match_tol`，则抛出错误。

新增函数：

```text
extract_matched_order_weight_from_details(...)
```

功能：

1. 从 `env_factor_rcwa(..., return_details=True)` 返回的 `details` 中读取：
   - `orders_m`
   - `kpara_eff_nm_inv`
   - `T_orders_s`
   - `T_orders_p`
2. 调用 `match_k_to_rcwa_order_1d(...)` 找到匹配级次。
3. 取出对应衍射级次的通道权重。
4. 当前支持三种极化选择：
   - `s`
   - `p`
   - `avg = 0.5 * (s + p)`

新增函数：

```text
compute_k_resolved_hbar_gamma_from_weight(...)
```

功能：

将匹配衍射级次的权重转换成一个相对的 `hbar*gamma` overlap proxy。这个函数现在主要对应旧的 `proxy` 耦合模型。

另外，当前新版还引入了 self-source 相关工具：

```text
compute_self_field_e_over_j_from_details(...)
compute_k_resolved_hbar_gamma_from_self_field(...)
```

功能：

1. 从 `env_factor_rcwa(..., return_details=True)` 的复数反射振幅、bottom stack 反射振幅、`kz_emit` 等信息中构造源驱动的局域反馈模型。
2. 仍然通过 `K = k_parallel + mG` 选出匹配衍射级次。
3. 计算通道自场耦合量 `E_K / J_K`。
4. 用 `P_rad ~ -0.5 * Re[J^* E]` 的符号结构转换成正的 `hbar*gamma` proxy。

## 5. K 分辨 self-field 与 proxy 模型

理想情况下，真正的自发辐射率应由激子电流片自身激发出的自场决定：

```text
P_rad(K, omega)
  = - A/2 * Re[ J_K^*(omega) · E_K^self(z_ex; omega) ]
```

等价地，在 `exp(-i omega t)` 约定下：

```text
Gamma_rad(K, omega)
  = A/(2 hbar) * Im[ P_K^*(omega) · E_K^self(z_ex; omega) ]
```

这里的关键是 `E_K^self` 必须是由激子电流片自身产生的场。如果 RCWA 只计算外部入射平面波的响应，那么得到的是外场驱动下的吸收、受激发射或功率交换，并不严格等同于自发辐射率。

### 5.1 默认 `self_source` 模型

新版当前默认使用：

```text
coupling_model = "self_source"
```

它不是单纯读取外部入射波的 transmission weight，而是构造一个源驱动的自场闭合模型：

1. 先通过 RCWA 得到 top-side 各衍射级次的复数反射振幅；复数相位会被保留。
2. 用 `K = k_parallel + mG` 找到与激子动量匹配的衍射级次。
3. 将 top RCWA 复反射和 bottom stack 的 TMM 反射组合成一个类似腔反馈的模型。
4. 在该通道上得到等效的自场耦合量：

```text
E_K / J_K
```

5. 再用 current-field work 的结构：

```text
P_rad ~ -0.5 * Re[J^* E]
```

把 `E_K / J_K` 转换为正的 `hbar*gamma` proxy。

因此，当前默认路径已经比旧 proxy 更接近“激子电流片源项驱动自身辐射场”的图像：它显式使用复数振幅、相位和上下界面反馈，而不是只使用强度型 transmission weight。

但它仍不是完整的 volumetric impressed-current RCWA 求解。也就是说，激子电流片还没有作为求解器核心中的边界条件或体源项直接进入 RCWA；当前实现是基于 `top RCWA + bottom TMM` 的 reduced cavity closure。

### 5.2 旧 `proxy` 模型

旧兼容模型仍然可以通过：

```text
coupling_model = "proxy"
```

启用。它采用实用闭合：

```text
E_self,K = i * chi_K * P_K
chi_K proportional to matched_harmonic_weight
```

这样可以得到正的 overlap contribution：

```text
hbar*Gamma_K = (A/2) * chi_K * |P_K|^2
```

在代码层面，`compute_k_resolved_hbar_gamma_from_weight(...)` 返回的是相对量。随后 `photons.py` 仍会复用 homogeneous DOS bin integral，并可以通过项目已有目标 `hbar_gamma_rad0` 做热平均校准。

## 6. `photons.py` 中的新增计算路径

### 6.1 修复 legacy stack gamma 路径

新增内部函数：

```text
_compute_hbar_gamma_from_stack(F_local, n_emit_local)
```

它恢复并明确了 legacy stack 路径：

```text
hbar_gamma[i]
  = F_local[i] * integrate_hbar_gamma_rad(kvec[i], kvec[i+1], n_emit_local[i]) / Abin[i]
```

这一步很重要，因为此前默认 `calculate_photon_matrix()` 路径中引用了未定义的内部函数，可能导致运行时失败。现在 legacy 默认路径可以继续作为兼容基线。

### 6.2 新增 K 分辨内部函数

新增内部函数：

```text
_compute_hbar_gamma_k_resolved(...)
```

它现在支持两类耦合模型：

```text
coupling_model = "self_source"   # 默认
coupling_model = "proxy"         # 旧的 transmission-weight proxy
```

默认 `self_source` 计算流程如下：

1. 如果没有显式传入 `rcwa_config`，则根据 `period_nm` 创建启用 grating 的 `GratingRCWAConfig`。
2. 对每个动量 bin center `k[i]`：
   - 取对应激子能量 `E_centers[i]`。
   - 调用 `env_factor_rcwa(..., return_details=True)`。
   - 读取局域发射折射率 `n_emit_i`。
   - 计算 homogeneous DOS bin integral：

```text
I_i = integrate_hbar_gamma_rad(kvec[i], kvec[i+1], n_emit_i)
```

3. 如果该点在发射介质光锥外，则当前实现将对应 `hbar_gamma[i]` 置零。
4. 如果 `coupling_model="self_source"`，调用 `compute_self_field_e_over_j_from_details(...)`：
   - 根据 `K = k_parallel + mG` 找到匹配级次。
   - 读取匹配级次的 top-side 复反射振幅。
   - 结合 bottom stack 反射与 `d_sheet_nm` 给出的相位反馈。
   - 得到 `E_K / J_K`。
5. 调用 `compute_k_resolved_hbar_gamma_from_self_field(...)` 得到 self-field overlap factor。
6. 组合得到：

```text
hbar_gamma[i] = overlap_factor * I_i / Abin[i]
```

7. 如果 `coupling_model="proxy"`，则回到旧逻辑：调用 `extract_matched_order_weight_from_details(...)` 读取匹配级次的 `avg/s/p` transmission weight，再用 `compute_k_resolved_hbar_gamma_from_weight(...)` 得到 overlap factor。
8. 如果设置了 `calibrate_target_hbar_gamma`，则对整条曲线做热平均，并缩放到项目目标平均辐射率。
9. 输出匹配 mismatch 的最大值和平均值，便于诊断 RCWA harmonic truncation 是否足够。

### 6.3 扩展公开 API

`calculate_photon_matrix(...)` 增加了 `method` 参数：

```text
method = "legacy"
method = "k_resolved"
```

并增加了 K 分辨路径的耦合模型参数：

```text
coupling_model = "self_source" | "proxy"
d_sheet_nm = 20.0
```

兼容别名包括：

- `legacy`
- `f_stack`
- `fstack`
- `k_resolved`
- `k-resolved`
- `kresolved`
- `self_source`
- `self-source`

默认仍为：

```text
method = "legacy"
```

这保证了 `timestepping.py`、`self_consistent_gamma.py` 等当前脚本在不改参数的情况下继续走 legacy 路径。

### 6.4 period sweep 支持方法选择

`calculate_radiative_rate_period_sweep(period_nm_values, method='legacy', coupling_model='self_source', d_sheet_nm=20.0)` 现在也支持：

```text
method = "k_resolved"
```

当选择 K 分辨路径时，每个 period 会创建对应的 `GratingRCWAConfig(enabled=True, period_nm=p)`，然后调用 K 分辨计算。`coupling_model` 和 `d_sheet_nm` 会传入每个 period 的计算。legacy 路径则继续先计算 `F_local, n_emit_local`，再调用 stack gamma 组合。

## 7. 命令行使用方式

### 7.1 默认 legacy 行为

```bash
python photons.py
```

等价于：

```bash
python photons.py --gamma-method legacy
```

### 7.2 使用 K 分辨路径

```bash
python photons.py --gamma-method k_resolved
```

### 7.3 指定 grating period

```bash
python photons.py --gamma-method k_resolved --period-nm 250
```

### 7.4 选择耦合模型

默认使用新版 self-source 模型：

```bash
python photons.py --gamma-method k_resolved --coupling-model self_source
```

如果需要强制使用旧 proxy 行为：

```bash
python photons.py --gamma-method k_resolved --coupling-model proxy
```

也可以指定 sheet 反馈相位中使用的距离参数：

```bash
python photons.py --gamma-method k_resolved --coupling-model self_source --d-sheet-nm 20
```

### 7.5 对多个 period 做扫描

```bash
python photons.py --gamma-method k_resolved --sweep-periods 220,250,280
```

配合 self-source 参数：

```bash
python photons.py --gamma-method k_resolved --sweep-periods 220,250,280 --coupling-model self_source --d-sheet-nm 20
```

### 7.6 建议运行环境

推荐在项目环境中运行：

```bash
conda activate exciton-env
```

如果当前 shell 中没有 `conda`，可以先用系统 `python3` 做语法或单元测试级别的检查，但涉及 RCWA 包、材料数据和完整数值流程时，仍应回到项目环境验证。

## 8. 验证内容

新增测试文件：

```text
tests/test_k_resolved_stack_optics.py
```

覆盖的核心行为包括：

1. `match_k_to_rcwa_order_1d(...)` 能正确找到满足 `K = k_parallel + mG` 的最近级次。
2. `extract_matched_order_weight_from_details(...)` 能从 order-resolved RCWA details 中取出匹配级次的平均 transmission weight。
3. `compute_k_resolved_hbar_gamma_from_weight(...)` 对 harmonic weight 具有线性缩放行为。
4. `compute_self_field_e_over_j_from_details(...)` 能从复数 RCWA/stack details 中得到有限的 `E_K / J_K`。
5. `compute_k_resolved_hbar_gamma_from_self_field(...)` 能把 self-field coupling 转换成非负的 `hbar*gamma` proxy。

建议验证命令：

```bash
python -m pytest tests/test_k_resolved_stack_optics.py
```

如果项目测试环境不完整，至少应确认：

- `stack_optics.py` 可以导入。
- `photons.py --gamma-method legacy` 不再因为缺失 `_compute_hbar_gamma_from_stack` 失败。
- `photons.py --gamma-method k_resolved --period-nm <value>` 能输出 mismatch 诊断信息。

## 9. 关键参数说明

### 9.1 `period_nm`

光栅周期，单位 nm。它决定倒格矢：

```text
G = 2*pi / period_nm
```

周期越大，`G` 越小；周期越小，衍射级次之间的动量间隔越大。

### 9.2 `orders_m`

RCWA 中保留的衍射级次数组。K 分辨匹配只能在已有 `orders_m` 中寻找合适的 `m`。如果 `K` 较大而 `n_harmonics` 太小，可能找不到足够接近的级次，导致 mismatch 变大。

### 9.3 `match_tol`

动量匹配容差，单位 `nm^-1`。默认用于诊断；如果启用 strict mode，则 mismatch 大于该值会抛出错误。

### 9.4 `strict_match`

是否强制要求匹配误差小于 `match_tol`。日常扫描建议先设为 `False`，通过日志观察 mismatch；做严格验证或 debug 时可以设为 `True`。

### 9.5 `polarization`

匹配级次权重可取：

- `s`
- `p`
- `avg`

当前 K 分辨路径默认使用 `avg`。

### 9.6 `calibrate_target_hbar_gamma`

用于把相对 overlap proxy 缩放到项目既有目标平均辐射率。默认使用 `hbar_gamma_rad0`。如果设为 `None`，则返回未校准的相对曲线。

### 9.7 `coupling_model`

K 分辨路径的耦合模型选择：

- `self_source`：默认值。使用复数 RCWA 反射振幅和 bottom TMM 反射构造源驱动自场反馈，得到 `E_K / J_K`。
- `proxy`：旧行为。只使用匹配衍射级次的 transmission weight 构造 `E_self,K = i * chi_K * P_K`。

### 9.8 `d_sheet_nm`

`self_source` 模型中的 sheet 反馈距离参数，默认 `20.0 nm`。它进入类似：

```text
phase2 = exp(2 i kz d_sheet_nm)
```

的上下反射反馈相位，因此会影响自场闭合中的局域增强或抑制。

## 10. 与 legacy 路径的关系

K 分辨路径不是完全替代 legacy 路径，而是一个更显式的周期结构实现方向。

legacy 路径：

```text
F_stack(k) * homogeneous_DOS_integral(k)
```

K 分辨路径：

```text
self_field_overlap(K) * homogeneous_DOS_integral(k)      # self_source 默认
matched_order_weight(K) * homogeneous_DOS_integral(k)    # proxy 旧模式
```

二者目前都保留 homogeneous DOS bin integral，因此仍与现有动量网格、热平均和动力学接口兼容。主要差别是 stack-dependent factor 的来源：

- legacy 路径使用整体环境因子 `F_stack`。
- K 分辨默认路径使用通过 `K = k_parallel + mG` 选出的 RCWA 匹配谐波通道，并进一步结合复数 top reflection、bottom reflection 和 sheet 相位反馈构造 `E_K / J_K`。
- K 分辨 `proxy` 路径则使用匹配级次的 transmission weight。

从物理严格性看，K 分辨 `self_source` 路径比旧 proxy 更接近 current-sheet overlap 的结构，因为它显式引入了源驱动自场耦合和相位反馈；但从数值成熟度看，它仍是 reduced cavity closure，并非完整的 impressed-current RCWA 求解。

## 11. 已知限制

### 11.1 `self_source` 仍不是完整 impressed-current RCWA

当前默认 `self_source` 路径是源驱动、相位感知的自场闭合模型。它会计算 `E_K / J_K`，并使用 top RCWA 复反射、bottom TMM 反射和 cavity-like feedback。

但它仍没有把激子电流片作为完整的 impressed current source 直接放入 RCWA 求解器核心中，也没有显式处理求解器内部的电流片边界不连续条件。因此它应理解为 `top RCWA + bottom TMM` 的 reduced source-feedback model，而不是严格的全场自发辐射 Green function 解。

### 11.2 homogeneous DOS 积分仍被复用

为了兼容现有项目流程，K 分辨路径仍复用：

```text
integrate_hbar_gamma_rad(kvec[i], kvec[i+1], n_emit_i)
```

这意味着它还不是一个完全从 RCWA Green function 或完整 source mode DOS 出发的辐射率公式。

### 11.3 harmonic truncation 会影响大 K 匹配

如果 `n_harmonics` 太小，`orders_m` 覆盖的 `m` 范围有限。对较大的 `K`，最近级次的 mismatch 可能不可忽略。此时应考虑增大 `n_harmonics`，并检查运行时间和收敛性。

### 11.4 light cone 判定仍需谨慎

当前实现中，如果 `env_factor_rcwa` 标记 `outside_emit_lightcone`，K 分辨路径会将该 bin 置零。对于光栅辅助 outcoupling 或折叠动量通道，这个判定是否应完全照搬，需要后续结合物理模型再确认。

### 11.5 默认几何的一致性问题

项目中不同脚本对 hBN、SiO2 等厚度参数的默认值可能并不完全一致。由于 momentum grid、`nref_global`、stack optical factor 都可能依赖这些参数，后续应统一或显式记录几何来源。

## 12. 推荐后续工作

1. 对比 legacy 与 K 分辨路径在相同 period 下的 `hbar_gamma(k)` 曲线，检查峰位、光锥附近行为和热平均值。
2. 扫描 `n_harmonics`，确认 mismatch 与辐射率曲线是否收敛。
3. 将 `strict_match=True` 用于小规模测试，暴露动量匹配失败的区间。
4. 明确 `outside_emit_lightcone` 在 grating-assisted radiation 中的物理含义，决定是否需要更细的通道级 light-cone 判定。
5. 继续改进 `self_source`：将激子电流片作为 RCWA 求解器中的显式 impressed current source，直接求 `E_self,K`，再用 current-field work formula 计算真正的 K 分辨辐射率。
6. 为 `photons.py --gamma-method k_resolved` 添加端到端测试，至少覆盖一个轻量 period 和小动量网格配置。

## 13. 快速检查清单

修改或使用 K 分辨路径时，建议逐项检查：

- `period_nm` 是否与目标结构一致。
- `n_harmonics` 是否足以覆盖目标 `K` 范围。
- mismatch 日志是否在可接受范围内。
- `T_orders_s`、`T_orders_p` 是否来自同一组 `orders_m`。
- `self_source` 中的复数反射振幅、bottom reflection 和 `d_sheet_nm` 是否与目标几何一致。
- `hbar_gamma(k)` 是否非负，且没有异常尖峰。
- 热平均校准前后的 scale 是否合理。
- legacy 与 K 分辨路径的差异是否能用物理图像解释。

## 14. 一句话总结

当前 K 分辨实现把周期结构中的动量选择规则 `K = k_parallel + mG` 显式引入辐射率计算；新版默认 `self_source` 路径进一步用复数 RCWA 反射振幅和 bottom-stack 反馈构造 `E_K / J_K` 的源驱动自场 proxy，而 `proxy` 模式保留旧的匹配级次权重实现。它是从经验 stack factor 走向完整 current-sheet self-field 辐射率求解的中间实现版本。

