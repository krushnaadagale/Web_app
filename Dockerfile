FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
# ```

# Also create `.dockerignore`:
# ```
# node_modules
# .env
# *.log