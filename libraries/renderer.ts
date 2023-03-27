/** @jsxImportSource "https://esm.sh/preact@10.13.1/jsx-runtime" */
import {
  css,
  Eta,
  getStyleTag,
  shim,
  theme,
  twApply as apply,
  twCreate,
  twSetup,
  virtualSheet,
} from '../deps.ts'
import config from '../config.ts'

const sheet = virtualSheet()

const globalStyles = css({
  ':global': {
    body: apply`font-sans min-h-screen bg-gray-100 p-4`,
  },
})

const twConfig = {
  hash: true,
  // deno-lint-ignore no-explicit-any
  preflight: (preflight: any) => css(preflight, globalStyles),
  theme: {
    fontFamily: {
      sans: ['Helvetica', 'sans-serif'],
      serif: ['Times', 'serif'],
    },
  },
  sheet,
}

twSetup(twConfig)

/**
 * Parse twind from rendered html. The shim works by detecting any Tailwind
 * classes names used in your app and wrap them in tw call under the hood.
 *
 * TODO: use full layout instead of include header and footer.
 */
export async function renderHtml<T>(template: string, data?: T) {
  Eta.configure(config.eta)
  sheet.reset()

  const { tw } = twCreate(twConfig)
  const tmpl = await Eta.renderFileAsync(`${template}.eta`, { ...data })
  const body = shim(tmpl, { tw })

  // Load HTML content from template
  return await Eta.renderFileAsync('_layout.eta', {
    styleTag: getStyleTag(sheet),
    body,
    ...data,
  })
}
