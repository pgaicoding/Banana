# OAuth 应用创建指南

## 🎯 需要创建的 OAuth 应用

1. **GitHub OAuth App**
2. **Google OAuth 2.0 Client**

---

## 1️⃣ 创建 GitHub OAuth App

### 步骤：

1. **访问 GitHub 开发者设置**
   ```
   https://github.com/settings/developers
   ```

2. **点击 "New OAuth App"**

3. **填写应用信息：**
   - **Application name**: `Banana AI`
   - **Homepage URL**: `https://banana.chinadeeplearning.com`
   - **Application description** (可选): `AI-powered image editing platform`
   - **Authorization callback URL**:
     ```
     https://banana.chinadeeplearning.com/api/auth/callback/github
     ```

4. **点击 "Register application"**

5. **获取凭据：**
   - 复制 **Client ID**
   - 点击 "Generate a new client secret"
   - 复制 **Client Secret** (只显示一次，请妥善保存)

6. **更新 `.env.local`：**
   ```bash
   GITHUB_CLIENT_ID="你的_client_id"
   GITHUB_CLIENT_SECRET="你的_client_secret"
   ```

---

## 2️⃣ 创建 Google OAuth 2.0 Client

### 步骤：

#### A. 创建 Google Cloud 项目

1. **访问 Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **创建新项目**
   - 点击顶部项目选择器
   - 点击 "NEW PROJECT"
   - 项目名称: `Banana AI`
   - 点击 "CREATE"

#### B. 启用 Google+ API (可选，但推荐)

1. 在左侧菜单选择 **APIs & Services** → **Library**
2. 搜索 "Google+ API"
3. 点击 "ENABLE"

#### C. 配置 OAuth 同意屏幕

1. **进入 OAuth consent screen**
   ```
   APIs & Services → OAuth consent screen
   ```

2. **选择用户类型**
   - 选择 **External** (外部)
   - 点击 "CREATE"

3. **填写应用信息：**
   - **App name**: `Banana AI`
   - **User support email**: 你的邮箱
   - **App logo** (可选): 上传 Logo
   - **Application home page**: `https://banana.chinadeeplearning.com`
   - **Application privacy policy link** (可选): `https://banana.chinadeeplearning.com/privacy`
   - **Application terms of service link** (可选): `https://banana.chinadeeplearning.com/terms`
   - **Authorized domains**:
     ```
     chinadeeplearning.com
     ```
   - **Developer contact information**: 你的邮箱

4. **点击 "SAVE AND CONTINUE"**

5. **Scopes (权限范围)**
   - 点击 "ADD OR REMOVE SCOPES"
   - 选择以下权限：
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - 点击 "UPDATE"
   - 点击 "SAVE AND CONTINUE"

6. **Test users** (测试用户)
   - 如果应用处于测试模式，添加测试用户邮箱
   - 点击 "SAVE AND CONTINUE"

7. **Summary**
   - 检查信息
   - 点击 "BACK TO DASHBOARD"

#### D. 创建 OAuth 2.0 Client ID

1. **进入 Credentials**
   ```
   APIs & Services → Credentials
   ```

2. **创建凭据**
   - 点击 "+ CREATE CREDENTIALS"
   - 选择 "OAuth client ID"

3. **配置 OAuth client**
   - **Application type**: `Web application`
   - **Name**: `Banana AI Web Client`

4. **Authorized JavaScript origins** (可选):
   ```
   https://banana.chinadeeplearning.com
   ```

5. **Authorized redirect URIs**:
   ```
   https://banana.chinadeeplearning.com/api/auth/callback/google
   ```

6. **点击 "CREATE"**

7. **获取凭据：**
   - 复制 **Client ID**
   - 复制 **Client Secret**

8. **更新 `.env.local`：**
   ```bash
   GOOGLE_CLIENT_ID="你的_client_id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="你的_client_secret"
   ```

---

## 3️⃣ 更新环境变量

完成后，您的 `.env.local` 应该包含：

```bash
# Environment variables
OPENROUTER_API_KEY=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
NEXT_PUBLIC_SITE_URL=https://banana.chinadeeplearning.com
NEXT_PUBLIC_SITE_NAME=Nano Banana

# Database Configuration
DATABASE_URL="mysql://banana:wWAtLyXZaKjy4b7h@192.168.1.168:3306/banana"

# NextAuth Configuration
NEXTAUTH_URL="https://banana.chinadeeplearning.com"
NEXTAUTH_SECRET="FPWL9473ofWlHMdCjk4wOTuB3YX8Un55FNb/Ov0xplU="

# GitHub OAuth
GITHUB_CLIENT_ID="你的_github_client_id"
GITHUB_CLIENT_SECRET="你的_github_client_secret"

# Google OAuth
GOOGLE_CLIENT_ID="你的_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="你的_google_client_secret"
```

---

## 4️⃣ 测试登录

### 本地测试 (http://localhost:3002)

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. 访问：`http://localhost:3002`

3. 点击右上角 "Sign In" 按钮

4. 选择 GitHub 或 Google 登录

5. **注意**：本地测试时 OAuth 回调可能失败，因为回调 URL 配置的是生产域名

### 生产测试 (https://banana.chinadeeplearning.com)

1. 部署到生产服务器

2. 访问：`https://banana.chinadeeplearning.com`

3. 点击 "Sign In"

4. 测试 GitHub 和 Google 登录

---

## 🔍 常见问题

### Q1: OAuth 回调失败
**原因**: 回调 URL 配置错误
**解决**:
- 检查 OAuth 应用中的回调 URL
- 确保 `NEXTAUTH_URL` 正确
- 确保使用 HTTPS

### Q2: "redirect_uri_mismatch" 错误
**原因**: 回调 URL 不匹配
**解决**:
- GitHub: 检查 `Authorization callback URL`
- Google: 检查 `Authorized redirect URIs`
- 确保 URL 完全一致（包括协议、域名、路径）

### Q3: Google 登录显示 "This app isn't verified"
**原因**: 应用未通过 Google 验证
**解决**:
- 点击 "Advanced" → "Go to Banana AI (unsafe)"
- 或者提交应用进行 Google 验证（生产环境推荐）

### Q4: 本地开发如何测试？
**方案 1**: 修改 OAuth 回调 URL 为 localhost
```
http://localhost:3002/api/auth/callback/github
http://localhost:3002/api/auth/callback/google
```

**方案 2**: 使用 ngrok 或 Cloudflare Tunnel 暴露本地服务

---

## ✅ 完成检查清单

- [ ] GitHub OAuth App 已创建
- [ ] GitHub Client ID 和 Secret 已添加到 `.env.local`
- [ ] Google Cloud 项目已创建
- [ ] Google OAuth 同意屏幕已配置
- [ ] Google OAuth Client ID 已创建
- [ ] Google Client ID 和 Secret 已添加到 `.env.local`
- [ ] 本地测试登录流程
- [ ] 生产环境测试登录流程

---

**创建时间**: 2025-11-15
**文档版本**: 1.0
