import {
  type ComponentContext,
  jsx,
  type ObservableEvent,
  run,
} from 'butterfloat'
import { map, type Subscription } from 'rxjs'
import { RocketRatingVm } from './02-vm.js'

interface RocketProps {
  rank: number
  vm: RocketRatingVm
}

interface RocketEvents {
  click: ObservableEvent<MouseEvent>
  hover: ObservableEvent<MouseEvent>
}

function Rocket(
  { rank, vm }: RocketProps,
  { bindImmediateEffect, events }: ComponentContext<RocketEvents>,
) {
  bindImmediateEffect(events.click, () => vm.saveRating(rank))
  bindImmediateEffect(events.hover, () => vm.updateHoverRating(rank))

  const isSelected = vm.bothRatings.pipe(
    map(
      ([rating, current]) =>
        current >= rank && (rating === 0 || rating >= current),
    ),
  )
  const isHovered = vm.bothRatings.pipe(
    map(([rating, current]) => rating >= rank && rating !== current),
  )
  const isSwapped = vm.rating.pipe(map((r) => rank > r))

  return (
    <span
      class="icon is-large"
      classBind={{
        'has-text-danger': isSelected,
        'has-text-link': isHovered,
      }}
      events={{ click: events.click, mouseover: events.hover }}
    >
      <i
        class="fa-duotone fa-regular fa-rocket fa-2x"
        classBind={{
          'fa-swap-opacity': isSwapped,
        }}
      />
    </span>
  )
}

interface RocketRatingProps {
  initialRating: number
}

interface RocketRatingEvents {
  leave: ObservableEvent<MouseEvent>
}

function RocketRating(
  { initialRating }: RocketRatingProps,
  { bindImmediateEffect, events }: ComponentContext<RocketRatingEvents>,
) {
  const vm = new RocketRatingVm(initialRating)

  bindImmediateEffect(events.leave, () => vm.updateHoverRating(0))

  const rockets = [1, 2, 3, 4, 5].map((rank) => <Rocket rank={rank} vm={vm} />)

  return <div events={{ mouseout: events.leave }}>{rockets}</div>
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
