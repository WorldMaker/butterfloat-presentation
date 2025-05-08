import {
  butterfly,
  type ComponentContext,
  jsx,
  type ObservableEvent,
  run,
} from 'butterfloat'
import {
  combineLatest,
  map,
  shareReplay,
  type Observable,
  type Subscription,
} from 'rxjs'

interface RocketProps {
  rank: number
  rating: Observable<number>
  hoverRating: Observable<number>
  onClick: (rank: number) => void
  onHover: (rank: number) => void
}

interface RocketEvents {
  click: ObservableEvent<MouseEvent>
  hover: ObservableEvent<MouseEvent>
}

function Rocket(
  { rank, rating, hoverRating, onClick, onHover }: RocketProps,
  { bindImmediateEffect, events }: ComponentContext<RocketEvents>,
) {
  // INFO: This looks like useEffect, but isn't
  bindImmediateEffect(events.click, () => onClick(rank))
  bindImmediateEffect(events.hover, () => onHover(rank))

  const bothRatings = combineLatest([hoverRating, rating]).pipe(shareReplay(1))
  const isSelected = bothRatings.pipe(
    map(
      ([rating, current]) =>
        current >= rank && (rating === 0 || rating >= current),
    ),
  )
  const isHovered = bothRatings.pipe(
    map(([rating, current]) => rating >= rank && rating !== current),
  )
  const isSwapped = rating.pipe(map((r) => rank > r))

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
  // INFO: This looks like useState, but isn't
  const [rating, setRating] = butterfly(initialRating)
  const [hoverRating, setHoverRating] = butterfly(0)

  // INFO: This looks like useEffect, but isn't
  bindImmediateEffect(events.leave, () => setHoverRating(0))

  const rockets = [1, 2, 3, 4, 5].map((rank) => (
    <Rocket
      rank={rank}
      rating={rating}
      onClick={setRating}
      hoverRating={hoverRating}
      onHover={setHoverRating}
    />
  ))

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
