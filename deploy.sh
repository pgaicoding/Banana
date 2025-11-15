#!/bin/bash
# Banana 项目部署脚本

echo "🍌 开始部署 Banana 项目..."

# 1. 安装依赖
echo "📦 安装依赖..."
pnpm install

# 2. 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
pnpm prisma generate

# 3. 构建项目
echo "🏗️  构建项目..."
pnpm build

# 4. 重启 PM2
echo "🔄 重启 PM2 服务..."
pm2 restart banana || pm2 start npm --name banana -- start

echo "✅ 部署完成！"
echo "🌐 访问: https://banana.chinadeeplearning.com"
