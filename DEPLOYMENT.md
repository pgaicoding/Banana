# Banana项目快速部署方案

## 📋 部署架构

```
本地开发机 (Windows)
    ↓ (Git Push / SCP)
Ubuntu服务器 (/data/web/Banana)
    ↓ (pnpm build + PM2运行在端口3001)
Cloudflare Tunnel (bt-tunnel)
    ↓ (HTTP/2代理)
公网访问: https://banana.chinadeeplearning.com
```

## 🎯 核心配置点

### 1. 端口分配
- **Banana项目**: 3001端口（PM2管理）
- **Dify**: 80端口
- **宝塔面板**: 8848端口
- **其他服务**: 80端口

### 2. Cloudflare Tunnel配置

**配置文件位置**: `/etc/cloudflared/config.yml`

**新增配置段**:
```yaml
  - hostname: banana.chinadeeplearning.com
    service: http://localhost:3001
    originRequest:
      noTLSVerify: true
```

**完整配置顺序**:
1. protocol: http2（必须保留第一行）
2. tunnel和credentials信息
3. ingress规则（banana新增在bt之后）
4. 最后是404 catch-all

### 3. PM2配置

**配置文件**: `/data/web/Banana/ecosystem.config.js`

**关键配置**:
```javascript
{
  name: 'banana',
  script: 'node_modules/next/dist/bin/next',
  args: 'start',
  env: {
    PORT: 3001,
    NODE_ENV: 'production'
  }
}
```

## ⚡ 快速部署命令（按顺序执行）

### 步骤1: 在服务器上克隆项目
```bash
ssh pengge@your-server-ip
mkdir -p /data/web && cd /data/web
git clone https://github.com/pgaicoding/Banana.git
cd Banana
```

### 步骤2: 安装依赖和构建
```bash
# 安装pnpm（如未安装）
sudo npm install -g pnpm

# 安装依赖
pnpm install

# 构建生产版本
pnpm build
```

### 步骤3: 配置PM2
```bash
# 安装PM2（如未安装）
sudo npm install -g pm2

# 创建配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'banana',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/data/web/Banana',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOSTNAME: '0.0.0.0'
    },
    error_file: '/data/web/Banana/logs/err.log',
    out_file: '/data/web/Banana/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true
  }]
}
EOF

# 创建日志目录
mkdir -p logs

# 启动应用
pm2 start ecosystem.config.js

# 测试本地访问
curl -I http://localhost:3001
```

### 步骤4: 配置开机自启
```bash
# 保存PM2进程列表
pm2 save

# 生成开机启动脚本
pm2 startup
# 执行输出的sudo命令
```

### 步骤5: 配置Cloudflare Tunnel
```bash
# 备份配置
sudo cp /etc/cloudflared/config.yml /etc/cloudflared/config.yml.backup_$(date +%Y%m%d_%H%M%S)

# 编辑配置（在bt.chinadeeplearning.com配置块之后添加banana配置）
sudo nano /etc/cloudflared/config.yml
```

**添加以下配置块**:
```yaml
  - hostname: banana.chinadeeplearning.com
    service: http://localhost:3001
    originRequest:
      noTLSVerify: true
```

**验证配置语法**:
```bash
cloudflared tunnel ingress validate
```

### 步骤6: 配置DNS
```bash
# 自动添加DNS记录
cloudflared tunnel route dns bt-tunnel banana.chinadeeplearning.com
```

### 步骤7: 重启服务
```bash
# 重启Cloudflare Tunnel
sudo systemctl restart cloudflared

# 验证状态
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -n 30 --no-pager

# 验证PM2
pm2 status
```

### 步骤8: 验证部署
```bash
# DNS解析
nslookup banana.chinadeeplearning.com

# HTTP测试
curl -I https://banana.chinadeeplearning.com

# 浏览器访问
# https://banana.chinadeeplearning.com
```

## ✅ 部署检查清单

```bash
# 1. 项目文件
[ ] /data/web/Banana 目录存在
[ ] .next 构建目录存在
[ ] node_modules 已安装

# 2. PM2进程
[ ] pm2 status 显示 banana: online
[ ] curl localhost:3001 返回 200
[ ] pm2 startup 已配置

# 3. Cloudflare Tunnel
[ ] /etc/cloudflared/config.yml 已更新
[ ] 第一行是 protocol: http2
[ ] banana配置已添加
[ ] cloudflared ingress validate 通过
[ ] systemctl status cloudflared 显示 active

# 4. DNS
[ ] nslookup banana.chinadeeplearning.com 解析成功
[ ] Cloudflare Dashboard 中看到 CNAME 记录

# 5. Web访问
[ ] https://banana.chinadeeplearning.com 可访问
[ ] HTTPS证书有效
[ ] 首页正常显示
```

## 🔧 常用管理命令

### PM2管理
```bash
pm2 status              # 查看状态
pm2 logs banana         # 查看日志
pm2 restart banana      # 重启应用
pm2 stop banana         # 停止应用
pm2 info banana         # 详细信息
```

### 更新代码
```bash
cd /data/web/Banana
git pull
pnpm install
pnpm build
pm2 restart banana
```

### Tunnel管理
```bash
sudo systemctl status cloudflared    # 查看状态
sudo systemctl restart cloudflared   # 重启服务
sudo journalctl -u cloudflared -f    # 实时日志
```

## 🐛 快速故障排除

### 问题：域名无法访问
```bash
# 1. 检查DNS
nslookup banana.chinadeeplearning.com

# 2. 检查PM2
pm2 status
curl localhost:3001

# 3. 检查Tunnel
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -n 50
```

### 问题：502错误
```bash
# 重启所有服务
pm2 restart banana
sudo systemctl restart cloudflared

# 等待30秒后再测试
sleep 30
curl -I https://banana.chinadeeplearning.com
```

### 问题：Error 1033
```bash
# 确认配置文件第一行有 protocol: http2
sudo head -1 /etc/cloudflared/config.yml

# 如果没有，添加并重启
sudo nano /etc/cloudflared/config.yml
# 第一行添加：protocol: http2
sudo systemctl restart cloudflared
```

## 📱 联系信息

- **完整文档**: `D:\ClaudeCode\SystemInstaller\Banana-Domain-Configuration-Guide.md`
- **项目仓库**: https://github.com/pgaicoding/Banana.git
- **目标域名**: https://banana.chinadeeplearning.com

---

**预计部署时间**: 30-45分钟
**难度**: 中等
**创建时间**: 2025-11-14
