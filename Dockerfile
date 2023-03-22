# syntax=docker/dockerfile:1
FROM cgr.dev/chainguard/deno:1.31 as base
LABEL org.opencontainers.image.source="https://github.com/riipandi/fastrue"

ARG PORT 8090
ENV PORT $PORT

COPY --chown=deno:deno . .

EXPOSE $PORT

CMD [ "run", "--allow-read", "--allow-net", "--allow-env", "fastrue.ts" ]
