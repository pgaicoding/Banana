# 🚀 认证系统快速开始指南

## 📊 当前进度：85% 完成

### ✅ 已完成的工作

1. **依赖安装** ✅
   - NextAuth.js v5
   - Prisma ORM
   - Prisma Adapter

2. **数据库配置** ✅
   - 数据库：`banana`
   - 用户：`banana`
   - 4 个表已创建：User, Account, Session, VerificationToken

3. **代码实现** ✅
   - NextAuth 配置：`lib/auth.ts`
   - Prisma Client：`lib/prisma.ts`
   - API 路由：`app/api/auth/[...nextauth]/route.ts`
   - 登录页面：`app/auth/signin/page.tsx`
   - 用户菜单：`components/user-menu.tsx`
   - Session Provider：`app/providers.tsx`
   - Header 更新：集成用户菜单

---

## 🎯 下一步：创建 OAuth 应用

### 需要完成的任务：

#### 1. 创建 GitHub OAuth App (10分钟)
📖 **详细步骤请查看：`OAUTH_SETUP_GUIDE.md` 第1节**

**快速步骤：**
1. 访问：https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   - Name: `Banana AI`
   - Homepage: `https://banana.chinadeeplearning.com`
   - Callback: `https://banana.chinadeeplearning.com/api/auth/callback/github`
4. 获取 Client ID 和 Secret
5. 更新 `.env.local`

#### 2. 创建 Google OAuth 2.0 (20分钟)
📖 **详细步骤请查看：`OAUTH_SETUP_GUIDE.md` 第2节**

**快速步骤：**
1. 访问：https://console.cloud.google.com/
2. 创建项目：`Banana AI`
3. 配置 OAuth 同意屏幕
4. 创建 OAuth Client ID
5. 添加回调 URL: `https://banana.chinadeeplearning.com/api/auth/callback/google`
6. 获取 Client ID 和 Secret
7. 更新 `.env.local`

---

## 🧪 测试步骤

### 本地测试

```bash
# 1. 确保环境变量已配置
cat .env.local

# 2. 启动开发服务器
pnpm dev

# 3. 访问
http://localhost:3002

# 4. 点击右上角 "Sign In"
# 5. 测试登录（可能需要配置本地回调 URL）
```

### 生产测试

```bash
# 1. 构建项目
pnpm build

# 2. 部署到服务器
# (使用您现有的部署流程)

# 3. 访问
https://banana.chinadeeplearning.com

# 4. 测试 GitHub 登录
# 5. 测试 Google 登录
# 6. 测试登出功能
```

---

## 📁 项目文件结构

```
D:\Projects\Banana\
├── prisma/
│   └── schema.prisma                    ✅ 数据库 Schema
├── lib/
│   ├── prisma.ts                        ✅ Prisma Client
│   └── auth.ts                          ✅ NextAuth 配置
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts             ✅ NextAuth API
│   ├── auth/
│   │   └── signin/
│   │       └── page.tsx                 ✅ 登录页面
│   ├── providers.tsx                    ✅ Session Provider
│   └── layout.tsx                       ✅ 已集成 Provider
├── components/
│   ├── user-menu.tsx                    ✅ 用户菜单
│   └── header.tsx                       ✅ 已集成用户菜单
├── .env.local                           ✅ 环境变量
├── AUTH_IMPLEMENTATION_PLAN.md          📖 完整实施方案
├── OAUTH_SETUP_GUIDE.md                 📖 OAuth 创建指南
└── AUTH_QUICK_START.md                  📖 本文件
```

---

## 🔧 环境变量检查清单

打开 `.env.local` 确认以下变量：

```bash
# ✅ 已配置
DATABASE_URL="mysql://banana:wWAtLyXZaKjy4b7h@192.168.1.168:3306/banana"
NEXTAUTH_URL="https://banana.chinadeeplearning.com"
NEXTAUTH_SECRET="FPWL9473ofWlHMdCjk4wOTuB3YX8Un55FNb/Ov0xplU="

# ⏳ 待配置（创建 OAuth 应用后）
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

---

## 🎨 UI 预览

### 登录页面
- 路径：`/auth/signin`
- 特点：
  - 🍌 Banana 主题设计
  - 黄色渐变背景
  - GitHub 和 Google 登录按钮
  - 响应式设计

### 用户菜单
- 位置：Header 右上角
- 功能：
  - 显示用户头像
  - 显示用户名和邮箱
  - Profile 链接
  - Sign out 按钮

---

## 🐛 常见问题

### Q: 本地测试时 OAuth 回调失败？
**A**: 因为回调 URL 配置的是生产域名。解决方案：
1. 在 OAuth 应用中添加本地回调 URL
2. 或使用 ngrok/Cloudflare Tunnel 测试

### Q: 数据库连接失败？
**A**: 检查：
1. MySQL 服务是否运行
2. 数据库凭据是否正确
3. 网络连接是否正常

### Q: "Module not found: next-auth/react"？
**A**: 运行：
```bash
pnpm install
```

---

## 📞 需要帮助？

1. **查看完整文档**：`AUTH_IMPLEMENTATION_PLAN.md`
2. **OAuth 创建指南**：`OAUTH_SETUP_GUIDE.md`
3. **检查开发服务器日志**
4. **查看浏览器控制台错误**

---

## ✅ 完成后的功能

- ✅ 用户可以使用 GitHub 账号登录
- ✅ 用户可以使用 Google 账号登录
- ✅ 登录状态持久化
- ✅ 用户信息存储在数据库
- ✅ 安全的 Session 管理
- ✅ 优雅的用户界面

---

**创建时间**: 2025-11-15
**完成进度**: 85%
**预计剩余时间**: 30分钟（创建 OAuth 应用）
