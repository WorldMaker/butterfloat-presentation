import { jsx, run } from 'butterfloat'
import type { Subscription } from 'rxjs'

interface RocketProps {
  highlight: boolean
}

function Rocket({ highlight }: RocketProps) {
  return (
    <span class={highlight ? 'icon is-large has-text-danger' : 'icon is-large'}>
      <i class="fa-duotone fa-regular fa-rocket fa-2x" />
    </span>
  )
}

interface RocketRatingProps {
  initialRating: number
}

function RocketRating({ initialRating }: RocketRatingProps) {
  return (
    <div>
      <Rocket highlight={initialRating >= 1} />
      <Rocket highlight={initialRating >= 2} />
      <Rocket highlight={initialRating >= 3} />
      <Rocket highlight={initialRating >= 4} />
      <Rocket highlight={initialRating >= 5} />
    </div>
  )
}

export class RocketRatingElement extends HTMLElement {
  #subscription: Subscription | null = null

  connectedCallback() {
    this.innerHTML = ''
    const initialRating = parseInt(
      this.getAttribute('initial-rating') ?? '0',
      10,
    )
    this.#subscription = run(this, () => (
      <RocketRating initialRating={initialRating} />
    ))
  }

  disconnectedCallback() {
    this.#subscription?.unsubscribe()
    this.#subscription = null
  }
}

customElements.define('rocket-rating', RocketRatingElement)
