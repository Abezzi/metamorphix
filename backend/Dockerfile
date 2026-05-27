FROM node:20-alpine

WORKDIR /app

# copy package files
COPY package*.json ./

# install all dependencies (including devDependencies for ts-node and drizzle-kit)
RUN npm ci

# copy source code
COPY . .

# clean previous build to avoid stale files, then, build typescript
RUN rm -rf dist && npm run build

EXPOSE 3000

CMD ["npm", "start"]
