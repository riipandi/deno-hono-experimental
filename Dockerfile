# syntax=docker/dockerfile:1
#===============================================================================
FROM --platform=linux/amd64 denoland/deno:alpine-1.32.1 as builder
LABEL org.opencontainers.image.source="https://github.com/riipandi/fastrue"

ARG PORT 9999
ARG FASTRUE_BASE_URL
ARG DATABASE_URL
ARG DATABASE_POOL

ENV PORT $PORT
ENV FASTRUE_BASE_URL $FASTRUE_BASE_URL
ENV DATABASE_URL $DATABASE_URL
ENV DATABASE_POOL $DATABASE_POOL

USER deno
WORKDIR /app

COPY deps.ts .
RUN deno cache deps.ts
ADD . .
RUN deno cache fastrue.ts

EXPOSE $PORT

# CMD [ "run", "--allow-read", "--allow-net", "--allow-env", "fastrue.ts" ]
ENTRYPOINT [ "./entrypoint.sh" ]
