import {
  buildStamp,
  makeTestComponentContext,
  makeTestEvent,
} from 'butterfloat'
import { JSDOM } from 'jsdom'
import { writeFile } from 'node:fs/promises'
import { NEVER } from 'rxjs'
import { RocketRatingVm } from './02-vm.js'

const dom = new JSDOM(`
<!doctype html>
<html>
  <head>
    <title>Butterfloat Web Component Presentation</title>
    <script type="importmap">
      {
        "imports": {
          "butterfloat": "./node_modules/butterfloat/index.js",
          "rxjs": "./vendor/rxjs.js"
        }
      }
    </script>
    <script type="module" src="01-main.js"></script>
    <script src="./vendor/fa.js"></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css"
    />
  </head>

  <body>
    <section class="hero is-danger">
      <div class="hero-body">
        <p class="title">
          <span class="icon"
            ><i class="fa-duotone fa-regular fa-presentation-screen"></i
          ></span>
          Butterfloat Web Component Presentation
        </p>
        <p class="subtitle">By Max Battcher</p>
      </div>
    </section>
    <section class="section">
      <rocket-rating initial-rating="4">
        <p>You will need JS enabled and loaded to view this component.</p>
      </rocket-rating>
    </section>
  </body>
</html>
`)

const { window } = dom
const { customElements, document, HTMLElement } = window
globalThis.customElements = {
  ...customElements,
  define: () => {},
}
globalThis.HTMLElement = HTMLElement

const { context: testRocketContext } = makeTestComponentContext({
  hover: makeTestEvent<MouseEvent>(NEVER),
  click: makeTestEvent<MouseEvent>(NEVER),
})

// imported dynamically for the `globalThis` context to work
const { Rocket } = await import('./01-main.js')
const rocketTree = Rocket(
  { rank: -999, vm: new RocketRatingVm(-1) },
  testRocketContext,
)
const rocketStamp = buildStamp(rocketTree, document)
rocketStamp.id = 'rocket-stamp'
document.body.append(rocketStamp)

await writeFile('00-index.html', dom.serialize())
