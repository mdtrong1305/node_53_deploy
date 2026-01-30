FROM node:22.16.0-alpine AS build

WORKDIR /app

# tạo node_module ---- 
# khi cài thêm thư viện
COPY package*.json ./
RUN npm install
# ----------------------

# khi chỉnh sửa codee
COPY . .

# lệnh chạy trong lúc đang build
RUN npm run build

# xoá các thư viện trong devDependencies
RUN npm prune --production

FROM node:22.16.0-alpine AS final

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# CMD lệnh sẽ chạy sau khi build xong
# node dist/main
CMD ["node", "dist/src/main.js"]