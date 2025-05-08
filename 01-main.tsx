import { run, Empty } from 'butterfloat'
import type { Subscription } from 'rxjs'

function RocketRating() {
  // TODO: Implement the RocketRating component
  return Empty()
}

export class RocketRatingElement extends HTMLElement {
  #subscription: Subscription | null = null

  connectedCallback() {
    this.innerHTML = '' // INFO: Quickly clear out the "No JS" message
    this.#subscription = run(this, RocketRating)
  }

  disconnectedCallback() {
    this.#subscription?.unsubscribe()
    this.#subscription = null
  }
}

// INFO: Register the custom element with the browser
customElements.define('rocket-rating', RocketRatingElement)
