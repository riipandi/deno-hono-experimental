# syntax=docker/dockerfile:1
FROM --platform=x86_64 cgr.dev/chainguard/deno:1.31 as base
LABEL org.opencontainers.image.source="https://github.com/riipandi/fastrue"

ARG PORT 9999
ARG FASTRUE_BASE_URL
ARG DATABASE_URL
ARG DATABASE_POOL

ENV PORT $PORT
ENV FASTRUE_BASE_URL $FASTRUE_BASE_URL
ENV DATABASE_URL $DATABASE_URL
ENV DATABASE_POOL $DATABASE_POOL

COPY --chown=deno:deno . .

EXPOSE $PORT

CMD [ "run", "--allow-read", "--allow-net", "--allow-env", "fastrue.ts" ]

#===============================================================================
# Stage 2: Runner
#===============================================================================
# FROM --platform=x86_64 cgr.dev/chainguard/static:latest as runner
# LABEL org.opencontainers.image.source="https://github.com/riipandi/fastrue"

# ARG PORT 9999
# ARG FASTRUE_BASE_URL
# ARG DATABASE_URL
# ARG DATABASE_POOL

# ENV PORT $PORT
# ENV FASTRUE_BASE_URL $FASTRUE_BASE_URL
# ENV DATABASE_URL $DATABASE_URL
# ENV DATABASE_POOL $DATABASE_POOL

# COPY --from=builder /app/fastrue .

# EXPOSE $PORT

# CMD [ "fastrue" ]
