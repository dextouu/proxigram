FROM node:18-alpine AS build-env

WORKDIR /app
COPY package.json ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Ajouter des valeurs par défaut aux variables d'environnement
ENV URL="http://127.0.0.1:3000"
ENV RSS="false"
ENV CACHE="false"
ENV PROXY="true"
ENV REDIS_URL="redis://localhost:6379"
ENV ITEMS_PER_RSS="10"
ENV FETCH_PROVIDERS="false"
ENV PROVIDERS_LIST_URL=""
ENV EXPIRE_TIME_FOR_RSS="3600"
ENV EXPIRE_TIME_FOR_POST="86400"
ENV FETCH_PROVIDERS_EVERY="300"
ENV EXPIRE_TIME_FOR_POSTS="86400"
ENV SLEEP_TIME_PER_REQUEST="1"
ENV USE_HEADLESS_PROVIDERS="false"
ENV EXPIRE_TIME_FOR_STORIES="86400"
ENV EXPIRE_TIME_FOR_PROFILE="3600"

# Construire l'application Next.js
RUN pnpm run build

RUN pnpm run build

FROM gcr.io/distroless/nodejs18-debian11:nonroot

WORKDIR /app

COPY --from=build-env /app/next.config.mjs ./
COPY --from=build-env /app/env.mjs ./
COPY --from=build-env /app/.next /app/.next
COPY --from=build-env /app/node_modules /app/node_modules
COPY --from=build-env /app/public /app/public

CMD ["./node_modules/next/dist/bin/next", "start"]
