# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Build del proyecto
RUN npm run build

# 2. Production Stage
FROM nginx:alpine

# Copiamos los archivos de build al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos configuración custom de nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos puerto 80
EXPOSE 80

# Arrancamos nginx
CMD ["nginx", "-g", "daemon off;"]
