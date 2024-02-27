FROM node:20 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# nginx 이미지 사용 3
FROM nginx:latest

WORKDIR /app

# 빌드된 앱 파일 복사 
COPY --from=builder /app/build /app

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

# container 실행 시 자동으로 실행할 command. nginx 시작함
CMD ["nginx", "-g", "daemon off;"]
