# Banana项目部署方案（宝塔面板架构）

## 📋 部署架构（基于你的现有配置）

```
Cloudflare Tunnel (HTTP/2)
    ↓ (localhost:80)
Nginx (宝塔面板管理)
    ↓ (反向代理到 localhost:3001)
PM2管理的Next.js应用
    ↓
项目目录: /www/wwwroot/banana.chinadeeplearning.com
```

## 🎯 与现有架构的统一

**你现有的配置模式**：
- 项目目录：`/www/wwwroot/{域名}/`
- Tunnel配置：所有域名 → `localhost:80`
- Nginx：由宝塔管理，端口80统一入口
- 应用：Nginx反向代理到具体端口

**Banana项目将采用同样模式**：
- 项目目录：`/www/wwwroot/banana.chinadeeplearning.com/`
- Tunnel配置：`banana.chinadeeplearning.com` → `localhost:80`
- Nginx配置：反向代理到 `localhost:3001`
- PM2管理：Next.js运行在端口3001

---

## ⚡ 快速部署步骤

### 第一步：在服务器创建项目目录并上传代码

```bash
# SSH登录服务器
ssh pengge@your-server-ip

# 创建项目目录
sudo mkdir -p /www/wwwroot/banana.chinadeeplearning.com
sudo chown -R pengge:pengge /www/wwwroot/banana.chinadeeplearning.com

# 进入目录并克隆项目
cd /www/wwwroot/banana.chinadeeplearning.com
git clone https://github.com/pgaicoding/Banana.git .

# 或者如果目录不为空：
# git clone https://github.com/pgaicoding/Banana.git temp
# mv temp/* .
# rm -rf temp
```

### 第二步：安装依赖并构建

```bash
cd /www/wwwroot/banana.chinadeeplearning.com

# 确保pnpm已安装
sudo npm install -g pnpm

# 安装依赖
pnpm install

# 构建生产版本
pnpm build

# 验证构建
ls -la .next/
```

### 第三步：配置PM2管理进程

```bash
# 确保PM2已安装
sudo npm install -g pm2

# 创建PM2配置文件
cat > /www/wwwroot/banana.chinadeeplearning.com/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'banana',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/www/wwwroot/banana.chinadeeplearning.com',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOSTNAME: '0.0.0.0'
    },
    error_file: '/www/wwwroot/banana.chinadeeplearning.com/logs/err.log',
    out_file: '/www/wwwroot/banana.chinadeeplearning.com/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true
  }]
}
EOF

# 创建日志目录
mkdir -p /www/wwwroot/banana.chinadeeplearning.com/logs

# 启动应用
cd /www/wwwroot/banana.chinadeeplearning.com
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 测试本地访问
curl -I http://localhost:3001

# 保存PM2进程列表
pm2 save

# 配置开机自启（如果之前没配置过）
pm2 startup
# 执行输出的sudo命令
```

### 第四步：在宝塔面板创建站点

**通过Web界面操作**：

1. 登录宝塔面板：https://bt.chinadeeplearning.com/801aff0e

2. **网站** → **添加站点**
   - 域名：`banana.chinadeeplearning.com`
   - 根目录：`/www/wwwroot/banana.chinadeeplearning.com`
   - PHP版本：选择"纯静态"
   - 数据库：不创建
   - FTP：不创建
   - 点击"提交"

3. 创建成功后，点击站点名称 → **设置**

### 第五步：配置Nginx反向代理

在宝塔面板中配置Nginx：

1. **网站** → 找到 `banana.chinadeeplearning.com` → **设置** → **配置文件**

2. 找到 `location / { ... }` 配置块，替换为：

```nginx
location / {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Next.js 特定配置
    proxy_buffering off;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
}

# Next.js 静态资源和API路由
location ~* ^/(_next|api)/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

3. 点击"保存"

4. 测试Nginx配置：**服务** → **Nginx** → **配置** → **检查配置**

5. 重载Nginx：**服务** → **Nginx** → **重载配置**

### 第六步：更新Cloudflare Tunnel配置

```bash
# 备份配置
sudo cp /etc/cloudflared/config.yml /etc/cloudflared/config.yml.backup_$(date +%Y%m%d_%H%M%S)

# 编辑配置文件
sudo nano /etc/cloudflared/config.yml
```

**在 pengge.chinadeeplearning.com 配置之后添加**：

```yaml
  - hostname: banana.chinadeeplearning.com
    service: http://localhost:80
    originRequest:
      noTLSVerify: true
```

**完整配置文件应该是**：

```yaml
protocol: http2
tunnel: bt-tunnel
credentials-file: /home/pengge/.cloudflared/af8df9d1-a880-4038-8942-44488293de60.json

ingress:
  - hostname: bt.chinadeeplearning.com
    service: https://192.168.1.168:8848
    originRequest:
      noTLSVerify: true
  - hostname: www.chinadeeplearning.com
    service: http://localhost:80
  - hostname: chinadeeplearning.com
    service: http://localhost:80
  - hostname: dify.chinadeeplearning.com
    service: http://localhost:80
  - hostname: n8n.chinadeeplearning.com
    service: http://localhost:80
  - hostname: models.chinadeeplearning.com
    service: http://localhost:80
  - hostname: pengge.chinadeeplearning.com
    service: http://localhost:80
    originRequest:
      noTLSVerify: true
  - hostname: banana.chinadeeplearning.com
    service: http://localhost:80
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

保存后验证配置：

```bash
# 验证语法
cloudflared tunnel ingress validate

# 应该显示 OK
```

### 第七步：配置DNS记录

```bash
# 自动添加DNS记录
cloudflared tunnel route dns bt-tunnel banana.chinadeeplearning.com
```

### 第八步：重启服务并验证

```bash
# 1. 重启Cloudflare Tunnel
sudo systemctl restart cloudflared

# 2. 查看Tunnel状态
sudo systemctl status cloudflared

# 3. 查看日志确认新域名已注册
sudo journalctl -u cloudflared -n 50 --no-pager

# 4. 验证PM2应用
pm2 status
pm2 logs banana --lines 20

# 5. 测试本地
curl -I http://localhost:3001
curl -I http://localhost:80 -H "Host: banana.chinadeeplearning.com"

# 6. 等待1-2分钟后测试DNS
nslookup banana.chinadeeplearning.com

# 7. 测试HTTPS访问
curl -I https://banana.chinadeeplearning.com

# 8. 浏览器访问
# https://banana.chinadeeplearning.com
```

---

## ✅ 部署完成检查清单

```bash
目录结构：
[ ] /www/wwwroot/banana.chinadeeplearning.com/ 存在
[ ] .next/ 构建目录存在
[ ] node_modules/ 已安装

PM2进程：
[ ] pm2 status 显示 banana: online
[ ] curl localhost:3001 返回 200
[ ] pm2 logs banana 无错误

宝塔面板：
[ ] 站点 banana.chinadeeplearning.com 已创建
[ ] Nginx配置已设置反向代理到3001
[ ] curl -H "Host: banana.chinadeeplearning.com" localhost:80 返回200

Cloudflare Tunnel：
[ ] config.yml 已更新，包含banana配置
[ ] protocol: http2 在第一行
[ ] cloudflared ingress validate 通过
[ ] systemctl status cloudflared 显示 active
[ ] 日志中看到4个tunnel连接

DNS和访问：
[ ] nslookup banana.chinadeeplearning.com 解析成功
[ ] curl https://banana.chinadeeplearning.com 返回200
[ ] 浏览器访问正常，HTTPS证书有效
[ ] 页面内容完整加载
```

---

## 🔧 日常管理命令

### PM2管理
```bash
cd /www/wwwroot/banana.chinadeeplearning.com
pm2 status                # 查看状态
pm2 logs banana          # 查看日志
pm2 restart banana       # 重启应用
pm2 stop banana          # 停止应用
```

### 更新代码
```bash
cd /www/wwwroot/banana.chinadeeplearning.com
git pull
pnpm install
pnpm build
pm2 restart banana
```

### Nginx管理（通过宝塔面板）
- 修改配置：网站 → 设置 → 配置文件
- 重载配置：服务 → Nginx → 重载配置
- 查看日志：网站 → 设置 → 日志

### Tunnel管理
```bash
sudo systemctl status cloudflared
sudo systemctl restart cloudflared
sudo journalctl -u cloudflared -f
```

---

## 🐛 故障排除

### 问题1：域名502错误

```bash
# 1. 检查PM2应用
pm2 status
curl localhost:3001

# 2. 检查Nginx配置
# 在宝塔面板：网站 → 设置 → 配置文件
# 确认 proxy_pass http://localhost:3001 配置正确

# 3. 测试Nginx到应用的连接
curl -I -H "Host: banana.chinadeeplearning.com" http://localhost:80

# 4. 重启服务
pm2 restart banana
# 宝塔面板：服务 → Nginx → 重载配置
sudo systemctl restart cloudflared
```

### 问题2：静态资源404

**原因**：Next.js静态资源路径问题

**检查Nginx配置**：
确保有以下配置段：
```nginx
location ~* ^/(_next|api)/ {
    proxy_pass http://localhost:3001;
    ...
}
```

### 问题3：应用崩溃重启

```bash
# 查看错误日志
pm2 logs banana --err --lines 100
tail -100 /www/wwwroot/banana.chinadeeplearning.com/logs/err.log

# 检查内存使用
pm2 info banana

# 增加内存限制（如需要）
# 修改 ecosystem.config.js 中的 max_memory_restart
```

---

## 📊 流量路径图

```
用户浏览器
    ↓ HTTPS
Cloudflare CDN + SSL
    ↓ HTTP/2 (Tunnel)
Ubuntu服务器 cloudflared
    ↓ HTTP (localhost:80)
Nginx (宝塔面板管理)
    ↓ HTTP (反向代理到 localhost:3001)
PM2管理的Next.js应用
    ↓
项目代码: /www/wwwroot/banana.chinadeeplearning.com
```

---

## 📝 与其他项目对比

| 项目 | 目录 | 端口 | 管理方式 |
|------|------|------|----------|
| www | /www/wwwroot/www.chinadeeplearning.com | 80 | Nginx直接服务 |
| pengge | /www/wwwroot/pengge.chinadeeplearning.com | 80 | Nginx直接服务 |
| **banana** | **/www/wwwroot/banana.chinadeeplearning.com** | **3001→80** | **PM2+Nginx代理** |
| dify | ? | 80 | ? |
| n8n | ? | 80 | ? |

所有项目统一通过：
- Nginx监听80端口
- Cloudflare Tunnel指向localhost:80
- Nginx根据域名分发到不同服务

---

## 📚 配置文件位置

```
项目目录: /www/wwwroot/banana.chinadeeplearning.com/
PM2配置: /www/wwwroot/banana.chinadeeplearning.com/ecosystem.config.js
Nginx配置: 宝塔面板 → 网站 → banana.chinadeeplearning.com → 配置文件
Tunnel配置: /etc/cloudflared/config.yml
日志文件: /www/wwwroot/banana.chinadeeplearning.com/logs/
```

---

**预计部署时间**：30-40分钟
**难度**：中等
**创建时间**：2025-11-14

---

## 🎯 下一步

部署完成后：
1. 在浏览器访问 https://banana.chinadeeplearning.com 验证
2. 测试图片上传功能
3. 检查响应式布局
4. 查看PM2日志确认无错误
5. 设置宝塔的定时备份任务（可选）
