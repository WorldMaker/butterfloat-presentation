import { butterfly, type StateSetter } from 'butterfloat'
import { combineLatest, shareReplay, type Observable } from 'rxjs'

export class RocketRatingVm {
  // HACK: This does seem like a lot of boilerplate for maximum type safety (encapsulation!)
  readonly #rating: Observable<number>
  readonly #setRating: (rating: StateSetter<number>) => void
  get rating() {
    return this.#rating
  }

  readonly #hoverRating: Observable<number>
  readonly #setHoverRating: (rating: StateSetter<number>) => void
  get hoverRating() {
    return this.#hoverRating
  }

  readonly #bothRatings: Observable<[number, number]>
  get bothRatings() {
    return this.#bothRatings
  }

  constructor(initialRating: number) {
    // NOTE: Winky frown rule: if a line starts with a frown, it must wink
    ;[this.#rating, this.#setRating] = butterfly(initialRating)
    ;[this.#hoverRating, this.#setHoverRating] = butterfly(0)
    // INFO: You can't useState in a class, but butterfly is fine with it
    // (It's just a BehaviorSubject under the hood)

    this.#bothRatings = combineLatest([this.hoverRating, this.rating]).pipe(
      shareReplay(1),
    )
  }

  updateHoverRating(rating: number) {
    this.#setHoverRating(rating)
  }

  saveRating(rating: number) {
    // TODO: This could call a backend API to save the rating
    this.#setRating(rating)
  }
}
