# 网站内容调整指南（Jekyll）

本项目是基于 Jekyll 的个人主页模板。你最常改的文件集中在 3 个位置：

- 页面正文：`_pages/about.md`
- 全局配置：`_config.yml`
- 顶部导航：`_data/navigation.yml`

---

## 1. 主要内容在哪改

### 1.1 主页正文（最常用）
文件：`_pages/about.md`

这里控制首页展示内容，包括：

- About Me 自我介绍
- News
- Publications
- Honors and Awards
- Educations
- Invited Talks
- Internships

你可以直接用 Markdown 编辑文本，也可以混用少量 HTML（模板本身支持）。

---

### 1.2 站点基础信息与侧边栏资料
文件：`_config.yml`

这里主要改：

- `title`：网站标题
- `description`：网站描述
- `repository`：GitHub 仓库（`用户名/仓库名`）
- `author` 下的个人信息（姓名、头像、邮箱、学校、城市、社交链接等）

注意：

- 修改 `_config.yml` 后，Jekyll 通常需要重启服务才能完全生效。

---

### 1.3 顶部导航菜单
文件：`_data/navigation.yml`

这里配置导航栏条目，如：

- 菜单名称 `title`
- 跳转锚点 `url`（例如 `/#about-me`）

如果你在 `about.md` 新增了章节，也要同步更新这里的导航项。

---

## 2. 图片、附件、静态资源放哪里

- 图片：`images/`
- 附件（如 PDF 简历）：`files/`
- 样式与脚本资源：`assets/`

在 Markdown 中引用示例：

```md
![头像](/images/your_photo.jpg)
[我的简历](/files/CV.pdf)
```

---

## 3. 推荐修改流程（每次照这个走）

1. 启动本地预览服务：
   ```bash
   bash run_server.sh
   ```
2. 打开浏览器：`http://127.0.0.1:4000`
3. 修改文件（通常先改 `_pages/about.md`）
4. 刷新查看效果（大部分内容会自动重载）
5. 若改了 `_config.yml`，重启一次服务再确认
6. 提交并推送：
   ```bash
   git add .
   git commit -m "Update homepage content"
   git push origin main
   ```

---

## 4. 常见改动对照表

- **改自我介绍文字** → `_pages/about.md`
- **改头像/姓名/邮箱/学校** → `_config.yml` 中 `author`
- **改顶部导航名称或顺序** → `_data/navigation.yml`
- **新增图片并在页面显示** → 图片放 `images/`，再在 `_pages/about.md` 引用
- **更新简历链接** → PDF 放 `files/`，再在 `_pages/about.md` 改链接

---

## 5. 常见问题

- 页面没变化：先确认 `run_server.sh` 是否在运行，再看终端有没有报错。
- 改了 `_config.yml` 无效：重启 Jekyll 服务。
- 导航点不到对应位置：检查 `navigation.yml` 的锚点是否和页面章节 ID 一致。

