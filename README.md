# 搜索导航网站

一个简洁、美观、实用的搜索导航网站，支持多搜索引擎切换，并提供后台管理功能。

## 项目概述

本项目是一个基于前端技术开发的搜索导航网站，旨在提供一个集成多个搜索引擎的便捷搜索平台。用户可以在一个页面上轻松切换不同的搜索引擎，包括Google、百度、Bing、GitHub、哔哩哔哩和Yandex等。项目还包含一个后台管理系统，允许管理员自定义和管理搜索引擎配置。

## 主要功能

### 前台搜索导航

- **多搜索引擎支持**：集成Google、百度、Bing、GitHub、哔哩哔哩和Yandex等多个搜索引擎
- **一键切换**：用户可以通过点击按钮快速切换不同的搜索引擎
- **搜索引擎信息展示**：显示当前选中搜索引擎的logo和简介
- **用户偏好记忆**：自动记住用户上次使用的搜索引擎
- **输入验证**：防止空查询提交，并提供视觉反馈
- **响应式设计**：适配不同尺寸的设备屏幕

### 后台管理系统

- **管理员登录**：安全的账户验证机制
- **搜索引擎管理**：查看、添加、编辑和删除搜索引擎
- **自定义配置**：可自定义搜索引擎的名称、标识符、URL、参数名、Logo路径和描述
- **数据持久化**：使用localStorage保存配置数据

## 技术实现

### 前端技术

- **HTML5/CSS3**：构建页面结构和样式
- **JavaScript**：实现交互功能和数据处理
- **LocalStorage API**：保存用户偏好和搜索引擎配置
- **Font Awesome**：提供图标支持
- **响应式设计**：使用媒体查询适配不同设备

### 数据存储

项目使用浏览器的LocalStorage API进行数据存储，主要存储以下数据：

- 搜索引擎配置信息（searchEngines）
- 用户偏好的搜索引擎（preferredEngine）
- 管理员登录状态（adminLoggedIn）

## 安装与使用

### 安装步骤

1. 克隆或下载项目代码到本地
   ```
   git clone https://github.com/xzq849/xzq849.github.io.git
   ```

2. 使用Web服务器（如Apache、Nginx）部署项目，或直接使用浏览器打开index.html文件

### 使用说明

#### 前台搜索

1. 打开网站首页
2. 选择需要使用的搜索引擎（默认为Google）
3. 在搜索框中输入关键词
4. 点击搜索按钮或按Enter键进行搜索

#### 后台管理

1. 点击首页底部的"后台管理"链接
2. 使用管理员账号登录（默认用户名：xzqmn，密码：x84907621）
3. 在后台管理界面可以查看、添加、编辑和删除搜索引擎
4. 点击"添加搜索引擎"按钮可以添加新的搜索引擎
5. 点击现有搜索引擎的编辑或删除按钮可以修改或删除搜索引擎

## 项目截图

### 前台搜索页面

![前台搜索页面](https://github.com/xzq849/xzq849.github.io/raw/main/screenshots/frontend.png)

### 后台管理页面

![后台管理页面](https://github.com/xzq849/xzq849.github.io/raw/main/screenshots/admin.png)

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个Pull Request

## 许可证

本项目采用MIT许可证 - 详情请参见LICENSE文件

## 联系方式

项目维护者：[xzq849](https://github.com/xzq849)

---

© 2025 搜索导航 | 保留所有权利