# 网站内容调整指南（Jekyll）

本项目是基于 Jekyll 的个人主页模板。你最常改的文件集中在这些位置：

- 首页内容：`_pages/about.md`
- 研究页面：`_pages/research.md`
- 笔记索引页：`_pages/notes.md`
- 笔记正文：`_posts/*.md`
- 全局配置：`_config.yml`
- 顶部导航：`_data/navigation.yml`

---

## 1. 主要内容在哪改

### 1.1 首页正文（About Me）
文件：`_pages/about.md`

这里控制首页展示内容（自我介绍、教育、项目等）。可使用 Markdown，也可混用少量 HTML。

---

### 1.2 Research 页面
文件：`_pages/research.md`

这是独立页面，默认地址是 `/research/`。适合放：

- 研究方向
- 代表项目
- 在研工作

---

### 1.3 Notes 页面（自动汇总笔记）
文件：`_pages/notes.md`

这是独立页面，默认地址是 `/notes/`。页面会自动遍历 `site.posts`，以卡片形式展示「封面（可选）+ 标题 + 日期 + 摘要 + Read more」，并支持顶部搜索与 tag 筛选。

控制项（front matter）常用字段：

- `permalink`：页面路径（如 `/notes/`）
- `title`：页面标题
- `excerpt`：页面摘要
- `author_profile`：是否显示左侧作者资料（`true/false`）

卡片摘要规则：

- 默认取每篇文章的 `post.excerpt`（未手动设置时通常是正文前几句）
- 卡片页会自动去除 HTML 并截断（当前约 30 词）
- 点击 `Read more` 或标题进入全文页
- 若单篇笔记有 `thumbnail`，会显示封面图；没有则自动回退为纯文本卡片

Notes 筛选规则：

- 搜索框：按标题 + 摘要关键词实时筛选（不区分大小写）
- Tag 按钮：按 `tags` 分类筛选
- 两者可叠加过滤
- `Clear` 按钮可一键清空搜索与 tag 筛选

---

### 1.4 笔记正文（每篇一文件）
目录：`_posts/`

每篇笔记是一个 Markdown 文件，命名格式：

`YYYY-MM-DD-your-title.md`

最小示例：

```md
---
title: "My First Note"
date: 2026-04-03 10:00:00 +0800
tags: [notes, theory, example]
---

这里写笔记正文。
```

如果想手动指定卡片摘要，可在单篇笔记 front matter 中加 `excerpt`：

```md
---
title: "My First Note"
date: 2026-04-03 10:00:00 +0800
excerpt: "This note introduces the core setup and key formulas."
---
```

如果想给卡片加封面图，可在单篇笔记 front matter 中加 `thumbnail`：

```md
---
title: "My First Note"
date: 2026-04-03 10:00:00 +0800
tags: [notes, theory, example]
thumbnail: /images/your-cover.jpg
---
```

---

### 1.5 站点基础信息与侧边栏资料
文件：`_config.yml`

这里主要改：

- `title`：网站标题
- `description`：网站描述
- `repository`：GitHub 仓库（`用户名/仓库名`）
- `author` 下的个人信息（姓名、头像、邮箱、学校、城市、社交链接等）

注意：

- 修改 `_config.yml` 后，Jekyll 通常需要重启服务才能完全生效。

---

### 1.6 顶部导航菜单
文件：`_data/navigation.yml`

这里配置导航栏条目：

- `title`：菜单名称
- `url`：跳转地址

两种常见跳转方式：

- 同页锚点：`/#about-me`
- 独立页面：`/research/`、`/notes/`

---

## 2. 图片、附件、静态资源放哪里

- 图片：`images/`
- 附件（如 PDF 简历）：`files/`
- 样式与脚本资源：`assets/`

在 Markdown 中引用示例（推荐）：

```md
![头像](/images/your_photo.jpg)
[我的简历](/files/CV.pdf)
```

### 2.1 重要：避免子页面资源 404

如果页面是 `/research/`、`/notes/` 这类子路径，资源请不要写相对路径（如 `images/a.png`、`assets/css/main.css`），否则会被解析成 `/research/images/...` 这类错误地址。

推荐两种写法：

- 根路径写法：`/images/a.png`、`/assets/css/main.css`
- Liquid 写法：`{{ '/images/a.png' | relative_url }}`

---

## 3. 推荐修改流程（每次照这个走）

1. 启动本地预览服务：
   ```bash
   bash run_server.sh
   ```
2. 打开浏览器：`http://127.0.0.1:4000`
3. 修改文件（按需求改 `_pages`、`_posts`、`_data/navigation.yml`）
4. 刷新查看效果（大部分内容会自动重载）
5. 若改了 `_config.yml`，重启一次服务再确认
6. 需要时做一次构建检查：
   ```bash
   bundle exec jekyll build
   ```
7. 提交并推送：
   ```bash
   git add .
   git commit -m "Update homepage content"
   git push origin main
   ```

---

## 4. 常见改动对照表

- **改首页自我介绍文字** → `_pages/about.md`
- **改 Research 页面内容** → `_pages/research.md`
- **改 Notes 页面标题/是否显示作者栏** → `_pages/notes.md` front matter
- **改 Notes 卡片结构/摘要长度/筛选逻辑** → `_pages/notes.md`
- **改 Notes 卡片封面显示逻辑** → `_pages/notes.md` 中 `post.thumbnail` 条件
- **改 Notes 卡片样式（边框、阴影、双列、封面图、搜索与 tag）** → `assets/css/main.scss` 中 `.notes-grid` / `.note-card` / `.notes-filter`
- **新增一篇笔记** → `_posts/YYYY-MM-DD-title.md`
- **给笔记增加 tag 分类** → 在对应 `_posts/*.md` front matter 增加 `tags: [tag1, tag2]`
- **改顶部导航名称或顺序** → `_data/navigation.yml`
- **改头像/姓名/邮箱/学校** → `_config.yml` 中 `author`
- **新增图片并在页面显示** → 图片放 `images/`，页面里用 `/images/...` 或 `relative_url`
- **更新简历链接** → PDF 放 `files/`，页面里链接到 `/files/...`

---

## 5. 常见问题

- 页面没变化：先确认 `run_server.sh` 是否在运行，再看终端有没有报错。
- 改了 `_config.yml` 无效：重启 Jekyll 服务。
- 导航点不到对应位置：检查 `navigation.yml` 的 `url` 是锚点还是页面路径。
- 子页面样式丢失/头像不显示：通常是资源用了相对路径，改为 `/assets/...`、`/images/...` 或 `relative_url`。
- Notes 筛不到内容：先确认文章 front matter 是否有 `tags`，再确认搜索关键词是否在标题或摘要里。

