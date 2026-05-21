# ─────────────────────────────────────────
# Stage 1 : Build React avec Node.js
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package.json EN PREMIER
# (optimisation cache Docker — npm install
#  ne se relance que si package.json change)
COPY package*.json ./
RUN npm ci

# Copier le reste du code
COPY . .

# Builder le projet React
RUN npm run build
# → génère /app/dist/ avec index.html + assets

# ─────────────────────────────────────────
# Stage 2 : Servir avec Nginx (~25Mo)
# ─────────────────────────────────────────
FROM nginx:alpine

# Copier UNIQUEMENT le build depuis Stage 1
# node_modules (300Mo+) n'est PAS inclus !
COPY --from=builder /app/dist /usr/share/nginx/html

# Config Nginx pour React Router + proxy API
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80