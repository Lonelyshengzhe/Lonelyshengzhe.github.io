---
title: "Overleaf 与 Cursor 联动配置指南"
date: 2026-04-03 10:00:00 +0800
permalink: /notes/git-overleaf-manual/
thumbnail: /images/overleaf_icon.png
tags: [code, git]
---



# Overleaf 与 Cursor 联动配置指南

  

## 方法一：使用 Git 集成（推荐）

  

Overleaf 支持 Git 集成，这是最稳定的同步方式。

  

### 步骤 1：在 Overleaf 中启用 Git

  

1. 登录 Overleaf

2. 在项目设置中找到 "Git" 选项

3. 如果尚未启用，点击 "Clone with Git"

4. 复制 Git URL，格式类似：

```

https://git.overleaf.com/XXXXXXX

```

  

### 步骤 2：在本地克隆项目

  

```bash

cd /Users/lishengzhe/Desktop/vscode/exciton/gmatrix

git clone https://git.overleaf.com/XXXXXXX .

```

  

注意：如果 `gmatrix` 目录已经有文件，需要先备份或清空。

  

### 步骤 3：配置 Git 自动同步

  

创建同步脚本：

  

```bash

#!/bin/bash

# sync-overleaf.sh

  

cd /Users/lishengzhe/Desktop/vscode/exciton/gmatrix

  

# 拉取最新的更改

git pull origin master

  

# 如果有本地更改，推送到 Overleaf

git add -A

git commit -m "Auto-sync from Cursor: $(date)"

git push origin master

```

  

使用方法：

1. 在 Cursor 中编辑文件

2. 运行 `./sync-overleaf.sh` 进行同步

  

---

  

## 方法二：手动文件同步

  

如果不想使用 Git，可以手动复制文件。

  

### 从 Cursor 到 Overleaf

1. 编辑完成后，打开 Overleaf 项目

2. 上传新版本的 `.tex` 文件

  

### 从 Overleaf 到 Cursor

1. 在 Overleaf 中点击 "Download" 下载 ZIP

2. 解压并覆盖本地文件

  

---

  

## 方法三：使用 rsync 同步脚本（高级）

  

创建一个双向同步脚本：

  

```bash

#!/bin/bash

# rsync-overleaf.sh

  

LOCAL_DIR="/Users/lishengzhe/Desktop/vscode/exciton/gmatrix"

OVERLEAF_ZIP="/path/to/overleaf/download.zip"

  

# 从 Overleaf ZIP 同步到本地

if [ -f "$OVERLEAF_ZIP" ]; then

echo "正在从 Overleaf 同步到本地..."

# 这里需要解压 ZIP 并复制文件

fi

  

# 从本地推送到 Overleaf（需要通过 Git 或其他方法）

echo "请手动上传文件到 Overleaf"

```

  

---

  

## 推荐的每日工作流程

  

### 开始工作时：

```bash

cd /Users/lishengzhe/Desktop/vscode/exciton/gmatrix

git pull origin master # 拉取 Overleaf 的最新更改

```

  

### 工作时：

- 在 Cursor 中正常编辑 `.tex` 文件

- 定期保存文件

  

### 结束工作时：

```bash

git add -A

git commit -m "Daily update: $(date +%Y-%m-%d)"

git push origin master # 推送到 Overleaf

```

  

---

  

## 注意事项

  

1. **Git URL 权限**：确保您有 Overleaf 项目的 Git 访问权限

2. **冲突处理**：如果同时修改，可能出现冲突，需要手动解决

3. **备份重要**：首次配置前，建议备份现有文件

4. **PDF 文件**：通常不需要同步 `.pdf`、`.aux`、`.log` 等编译产物

  

---

  

## 故障排除

  

### Git 认证问题

如果遇到认证问题，Overleaf 可能需要 Token：

```bash

git config --global credential.helper store

```

  

### 文件冲突

如果文件已被修改：

```bash

git status # 查看状态

git diff # 查看差异

# 手动解决冲突后

git add .

git commit -m "Resolve conflicts"

git push origin master

```

  

---

  

## 有用的 Git 命令

  

```bash

# 查看更改

git status

git diff

  

# 放弃本地更改（恢复到最后一次 pull 的状态）

git checkout .

  

# 查看提交历史

git log --oneline

  

# 创建分支（用于实验性更改）

git checkout -b experiment

```

# sync-overleaf.sh 使用文档

  

## 📋 快速开始

  

### 1. 准备工作

  

首先，确保脚本有执行权限：

  

```bash

cd /Users/lishengzhe/Desktop/vscode/exciton/gmatrix/scripts

chmod +x sync-overleaf.sh

```

  

### 2. 获取 Overleaf Git URL

  

1. 登录 [Overleaf](https://www.overleaf.com)

2. 打开您的项目

3. 点击左侧菜单的 **"Menu"** → **"Git"**

4. 如果尚未启用，点击 **"Clone with Git"** 或 **"Enable Git"**

5. 复制显示的 Git URL（格式类似：`https://git.overleaf.com/xxxxx` 或 `git@git.overleaf.com:xxxxx`）

  

### 3. 初始化仓库（首次使用）

  

在脚本所在目录运行：

  

```bash

./sync-overleaf.sh setup

```

  

按提示输入您的 Overleaf Git URL，脚本会自动：

- ✅ 初始化 Git 仓库

- ✅ 创建 `.gitignore`（忽略编译产物）

- ✅ 配置远程仓库连接

  

---

  

## 🚀 日常使用

  

### 基本命令

  

```bash

# 查看当前状态（默认命令）

./sync-overleaf.sh status

  

# 从 Overleaf 拉取最新更改

./sync-overleaf.sh pull

  

# 推送本地更改到 Overleaf

./sync-overleaf.sh push

```

  

### 推荐工作流程

  

#### 开始工作时

  

```bash

./sync-overleaf.sh pull

```

  

这会从 Overleaf 下载最新的文件，确保您从最新版本开始工作。

  

#### 工作期间

  

在 Cursor 中正常编辑您的 LaTeX 文件（`.tex`、`.bib` 等）。

  

#### 结束工作时

  

```bash

./sync-overleaf.sh push

```

  

脚本会自动：

1. 检测所有更改的文件

2. 自动提交（带时间戳）

3. 推送到 Overleaf

  

---

  

## 📖 命令详解

  

### `status` - 查看状态

  

**用途：** 查看仓库信息、本地更改和提交历史

  

**示例输出：**

```

[INFO] 查看 Git 状态...

  

=== 远程仓库信息 ===

origin https://git.overleaf.com/xxxxx (fetch)

origin https://git.overleaf.com/xxxxx (push)

  

=== 当前分支 ===

* master

  

=== 本地更改 ===

modified: main.tex

  

=== 最近 5 次提交 ===

abc1234 Cursor sync: 2024-10-31 21:30:45

def5678 Cursor sync: 2024-10-31 20:15:30

...

```

  

**使用场景：**

- 检查是否有未保存的更改

- 查看最近的提交历史

- 调试同步问题

  

---

  

### `pull` - 拉取最新更改

  

**用途：** 从 Overleaf 下载最新文件到本地

  

**执行过程：**

1. 检查 Git 仓库配置

2. 尝试从 `master` 或 `main` 分支拉取

3. 自动合并更改

  

**使用场景：**

- 开始工作前获取最新版本

- 与协作者协作时同步更改

- 在 Overleaf 上编辑后，需要同步到本地

  

**注意事项：**

- 如果有冲突，需要手动解决

- 拉取前建议先查看 `status` 确认本地状态

  

---

  

### `push` - 推送本地更改

  

**用途：** 将本地更改上传到 Overleaf

  

**执行过程：**

1. 检查是否有未提交的更改

2. 如果有更改，自动执行：

- `git add -A`（添加所有更改）

- `git commit -m "Cursor sync: 时间戳"`（提交）

3. 推送到 Overleaf

  

**使用场景：**

- 在 Cursor 中编辑完成后

- 定期保存工作进度

- 与协作者分享更改

  

**注意事项：**

- 如果没有更改，会提示"没有需要提交的更改"并直接退出

- 推送前会自动提交，无需手动操作

  

---

  

### `setup` - 初始化仓库

  

**用途：** 首次设置 Git 仓库并连接到 Overleaf

  

**执行过程：**

1. 检查是否已有 Git 仓库

2. 提示输入 Overleaf Git URL

3. 初始化 Git 仓库

4. 创建 `.gitignore` 文件

5. 添加远程仓库

  

**使用场景：**

- 第一次使用脚本时

- 在新项目目录中设置同步

  

**注意事项：**

- 只需运行一次

- 如果目录已有 `.git`，会询问是否重新初始化

  

---

  

## 🔄 常见使用场景

  

### 场景 1：全新项目设置

  

```bash

# 1. 进入脚本目录

cd /Users/lishengzhe/Desktop/vscode/exciton/gmatrix/scripts

  

# 2. 添加执行权限（首次）

chmod +x sync-overleaf.sh

  

# 3. 初始化仓库

./sync-overleaf.sh setup

# 输入 Overleaf Git URL

  

# 4. 首次推送（如果本地有文件）

./sync-overleaf.sh push

```

  

### 场景 2：日常编辑流程

  

```bash

# 开始工作

./sync-overleaf.sh pull

  

# 在 Cursor 中编辑文件...

  

# 结束工作

./sync-overleaf.sh push

```

  

### 场景 3：与协作者协作

  

```bash

# 每次开始工作前

./sync-overleaf.sh pull # 获取协作者的最新更改

  

# 编辑文件...

  

# 工作结束后

./sync-overleaf.sh push # 分享您的更改

```

  

### 场景 4：检查工作状态

  

```bash

# 不确定是否有未保存的更改？

./sync-overleaf.sh status

  

# 查看最近做了什么

./sync-overleaf.sh status # 会显示最近 5 次提交

```

  

---

  

## ⚠️ 常见问题

  

### Q1: 推送时提示"认证失败"

  

**解决方案：**

  

**HTTPS 方式：**

- 首次推送会提示输入用户名和密码

- 用户名：您的 Overleaf 邮箱

- 密码：使用 Overleaf 的 Git 密码（不是登录密码，需要在 Overleaf 设置中生成）

  

**SSH 方式：**

- 需要在 Overleaf 设置中添加 SSH 公钥

- 确保本地已配置 SSH key

  

### Q2: 拉取时出现冲突

  

**解决方案：**

```bash

# 1. 查看冲突文件

git status

  

# 2. 手动编辑冲突文件（会看到 <<<<<<< 标记）

# 3. 解决冲突后

git add .

git commit -m "Resolve conflicts"

./sync-overleaf.sh push

```

  

### Q3: 脚本提示"当前目录不是 Git 仓库"

  

**解决方案：**

```bash

# 运行初始化

./sync-overleaf.sh setup

```

  

### Q4: 想撤销最后一次推送

  

**解决方案：**

```bash

# 查看提交历史

git log --oneline

  

# 重置到上一个提交（本地）

git reset --soft HEAD~1

  

# 如果需要强制推送（谨慎使用）

git push origin master --force

```

  

### Q5: 脚本在哪个目录运行？

  

**重要：** 脚本会自动切换到脚本所在目录（`scripts/`），但 Git 操作会在该目录执行。

  

如果您的 LaTeX 文件在其他目录，需要：

1. 在 LaTeX 文件所在目录初始化 Git

2. 或者修改脚本中的工作目录

  

---

  

## 🛠️ 高级用法

  

### 查看详细 Git 信息

  

```bash

# 查看所有分支

git branch -a

  

# 查看提交历史（详细）

git log

  

# 查看文件差异

git diff

  

# 查看特定文件的更改历史

git log --follow main.tex

```

  

### 手动 Git 操作

  

如果需要更精细的控制，可以直接使用 Git 命令：

  

```bash

# 只提交特定文件

git add main.tex

git commit -m "Update main.tex"

git push origin master

  

# 查看远程仓库信息

git remote -v

  

# 修改远程仓库 URL

git remote set-url origin [新的URL]

```

  

---

  

## 📝 注意事项

  

1. **备份重要文件**：首次设置前，建议备份重要文件

2. **编译产物**：`.gitignore` 已配置忽略 `.aux`、`.log`、`.pdf` 等编译产物

3. **分支名称**：脚本自动支持 `master` 和 `main` 分支

4. **提交信息**：自动生成的提交信息格式为 `Cursor sync: YYYY-MM-DD HH:MM:SS`

5. **网络问题**：如果推送/拉取失败，检查网络连接后重试

  

---

  

## 🔗 相关文档

  

- [SYNC_SCRIPT_EXPLAINED.md](./SYNC_SCRIPT_EXPLAINED.md) - 脚本功能详细说明

- [OVERLEAF_SYNC_SETUP.md](./OVERLEAF_SYNC_SETUP.md) - Overleaf 配置指南

  

---

  

## 💡 提示

  

- **定期同步**：建议每次工作前后都运行 `pull` 和 `push`

- **查看状态**：不确定时运行 `status` 查看当前状态

- **解决冲突**：遇到冲突时，仔细检查冲突标记，保留需要的更改

- **备份习惯**：重要更改前建议先 `push` 保存

  

---

  

**最后更新：** 2024-10-31

这是一个为你准备的 Markdown 格式的操作指南。你可以把它保存为 `SYNC_GUIDE.md` 放在你的项目根目录里，方便随时查看。

---

# 🔄 Git 同步指南：处理 Overleaf 与本地同时修改的情况

当 **Overleaf（远程仓库）** 和 **本地代码** 都有了各自的新提交时，直接 `git push` 会失败。此时你需要执行 **“先拉取合并，再推送”** 的流程。

## 📋 核心流程速览

1. **保存**：先把本地的修改全部提交（Commit）。
    
2. **拉取**：把 Overleaf 的修改拉下来并合并（Pull）。
    
3. **解决**：如果有冲突，手动修改文件并重新提交。
    
4. **验证**：在本地编译 LaTeX 确保无误。
    
5. **推送**：把最终结果推送到 Overleaf（Push）。
    

---

## 🛠 详细步骤

### 第一步：提交本地更改

在拉取别人的代码之前，必须确保你“手里”的东西已经放好了。

Bash

```
# 1. 添加所有修改到暂存区
git add .

# 2. 提交到本地仓库
git commit -m "本地更新：描述你做了什么修改"
```

### 第二步：拉取 Overleaf 的更新

这一步会将远程的更改下载并尝试与你的代码融合。

Bash

```
# 如果你的主分支叫 master
git pull origin master

# 如果你的主分支叫 main
# git pull origin main
```

此时会出现两种结果：

#### ✅ 结果 A：自动合并成功

终端提示 `Merge made by the 'ort' strategy.`。

- **状态**：Git 自动把两边的修改拼好了。
    
- **操作**：直接跳到**第四步**。
    

#### ⚠️ 结果 B：产生冲突 (CONFLICT)

终端提示 `CONFLICT (content): Merge conflict in main.tex`。

- **状态**：你和 Overleaf 修改了同一个文件的同一行，Git 不知道听谁的。
    
- **操作**：必须手动解决冲突（见下方）。
    

---

### 🚨 如何解决冲突

1. **打开报错的文件**（例如 `main.tex`）。
    
2. **寻找冲突标记**，你会看到类似的内容：
    
    代码段
    
    ```
    <<<<<<< HEAD
    \section{这是我本地写的标题}
    =======
    \section{这是 Overleaf 上写的标题}
    >>>>>>> ab1234f...
    ```
    
3. **修改代码**：
    
    - 决定保留哪一个，或者将两者结合。
        
    - **务必删除** `<<<<<<<`, `=======`, `>>>>>>>` 这三行标记。
        
4. **标记解决并提交**：
    
    Bash
    
    ```
    # 告诉 Git 这个文件修好了
    git add main.tex
    
    # 提交这次合并
    git commit -m "解决合并冲突"
    ```
    

---

### 第三步：本地编译检查 (重要)

在推送回 Overleaf 之前，建议在本地编译一下 PDF。

- **原因**：合并后的代码可能有语法错误（比如多了一个括号）。如果不检查直接推送到 Overleaf，可能会导致 Overleaf 编译报错，影响协作者。
    

### 第四步：推送到 Overleaf

现在你的本地代码是最新的，且包含了双方的修改。

Bash

```
git push origin master
```

---

## 💡 进阶技巧：使用 Rebase (变基)

如果你希望提交历史是一条干净的直线（没有分叉的合并记录），可以使用 `rebase`。

Bash

```
# 1. 提交本地修改
git commit -m "我的修改"

# 2. 拉取并变基（把我的修改“拔”下来，插在 Overleaf 的最新提交之后）
git pull --rebase origin master

# 3. 如果遇到冲突，解决后执行：
# git add .
# git rebase --continue

# 4. 推送
git push origin master
```

> **注意**：如果不熟悉 Git，建议优先使用上面的标准 `git pull` (Merge) 方法，比较不容易出错。