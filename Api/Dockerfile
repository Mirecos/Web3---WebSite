FROM node:20-alpine

ARG HOSTNAME
ARG PORT
ARG DATABASE_URL
ARG JWT_SECRET
ARG TOKEN_EXPIRATION_DAYS

ENV HOSTNAME=$HOSTNAME
ENV PORT=$PORT
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV TOKEN_EXPIRATION_DAYS=$TOKEN_EXPIRATION_DAYS

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
ENV FRONTEND_URL="${FRONTEND_URL}"


RUN apk update
# Needed for prisma to work fine
RUN apk add openssl

RUN npm install -g pnpm
RUN pnpm --version

COPY . ./api

WORKDIR /api
RUN pnpm install

CMD /api/start.sh

EXPOSE 8080