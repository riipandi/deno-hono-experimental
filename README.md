# Fastrue

[![Creator Badge](https://badgen.net/badge/icon/Made%20by%20Aris%20Ripandi?icon=bitcoin-lightning&label&color=blue&labelColor=black&style=flat-square)](https://ripandis.com)
[![Twitter Badge](https://badgen.net/badge/icon/Follow%20Twitter?icon=twitter&label&color=blue&labelColor=black&style=flat-square)](https://twitter.com/riipandi)
[![GitHub contributors](https://img.shields.io/github/contributors/riipandi/fastrue?style=flat-square)](https://github.com/riipandi/fastrue/graphs/contributors)
[![License Bagde](https://badgen.net/github/license/riipandi/fastrue?label=license&color=blue&labelColor=black&style=flat-square)](./LICENSE)
[![Github Sponsor](https://badgen.net/badge/icon/sponsors?icon=github&label&color=green&labelColor=black&style=flat-square)](https://github.com/sponsors/riipandi)

<hr/>

Fastrue is GoTrue compatible headless authentication server.

GoTrue is a JWT based API for managing users and issuing JWT tokens from Netlify.

## Quick Start

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
deno task run
```

Open <http://localhost:8090> to view it in the browser.

### Compile binary

```sh
deno task compile
```


### Test with curl

```sh
curl -H 'Authorization: Bearer secret' http://localhost:8090/login
```

## Further help

To learn more about Deno and Hono, check out the [Deno Documentation](https://deno.land/) [Hono Documentation](https://hono.dev/).

## License

This project is open-sourced software licensed under the [MIT license][choosealicense]

Copyrights in this project are retained by their contributors.

See the [license file](./LICENSE) for more information.

[choosealicense]: https://choosealicense.com/licenses/mit/

---

<sub>🤫 Psst! If you like my work you can support me via [GitHub sponsors](https://github.com/sponsors/riipandi).
