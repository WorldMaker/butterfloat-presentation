import { run, Empty } from 'butterfloat'
import type { Subscription } from 'rxjs'

function RocketRating() {
  // TODO: Implement the RocketRating component
  return Empty()
}

export class RocketRatingElement extends HTMLElement {
  #subscription: Subscription | null = null

  connectedCallback() {
    this.innerHTML = ''
    this.#subscription = run(this, RocketRating)
  }

  disconnectedCallback() {
    this.#subscription?.unsubscribe()
    this.#subscription = null
  }
}

customElements.define('rocket-rating', RocketRatingElement)
