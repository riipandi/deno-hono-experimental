# Fastrue

[![Creator Badge](https://badgen.net/badge/icon/Made%20by%20Aris%20Ripandi?icon=bitcoin-lightning&label&color=blue&labelColor=black&style=flat-square)](https://ripandis.com)
[![Twitter Badge](https://badgen.net/badge/icon/Follow%20Twitter?icon=twitter&label&color=blue&labelColor=black&style=flat-square)](https://twitter.com/riipandi)
[![GitHub contributors](https://img.shields.io/github/contributors/riipandi/fastrue?style=flat-square)](https://github.com/riipandi/fastrue/graphs/contributors)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](./CODE_OF_CONDUCT.md)
[![License Bagde](https://badgen.net/github/license/riipandi/fastrue?label=license&color=blue&labelColor=black&style=flat-square)](./LICENSE)
[![Github Sponsor](https://badgen.net/badge/icon/sponsors?icon=github&label&color=green&labelColor=black&style=flat-square)](https://github.com/sponsors/riipandi)

<hr/>

> **WARNING!** This project still in development.
> Everything is experimental, breaking changes can happen and the long-term purpose of this project is not yet clear, use at your own risk!

Headless authentication server for securing your apps, inspired by Netlify GoTrue, but built with [Deno](https://deno.land/).

[GoTrue](https://github.com/netlify/gotrue) is a JWT based API for managing users and issuing JWT tokens from Netlify.

## Quick Start

### Database Connection

```plain
Postgres  : postgres://postgres:postgres@127.0.0.1:5432/fastrue?sslmode=disable
Cockroach : postgres://root@127.0.0.1:26257/fastrue?sslmode=disable
```

### Database Tasks
```sh
deno task db:make-migration create_users
deno task db:make-seeder default_users

deno task db:status
deno task db:migrate
deno task db:rollback
deno task db:reset
```

### Run the app

```sh
deno task run          # Start with host timezine
TZ=UTC deno task run   # Start with UTC timezone
```

Open <http://localhost:9999> to view it in the browser.

### Compile binary

```sh
deno task compile
```


### Test with curl

```sh
curl -H 'Authorization: Bearer secret' http://localhost:9999/token
```

## Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/mlDOsy?referralCode=aris)

## Further help

To learn more about Deno and Hono, check out the [Deno Documentation](https://deno.land/) and [Hono Documentation](https://hono.dev/).

## License

This project is open-sourced software licensed under the [MIT license][choosealicense]

Copyrights in this project are retained by their contributors.

See the [license file](./LICENSE) for more information.

[choosealicense]: https://choosealicense.com/licenses/mit/

---

<sub>🤫 Psst! If you like my work you can support me via [GitHub sponsors](https://github.com/sponsors/riipandi).
