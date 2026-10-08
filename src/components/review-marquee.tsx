const cards = [
  {
    mark: "01",
    title: "Tu encuentro",
    text: "Una idea puede convertirse en una experiencia que reúna a toda una comunidad.",
  },
  {
    mark: "02",
    title: "Tu voz",
    text: "Cada encuentro merece ser contado por quienes lo vivieron. Aquí encontrará su lugar tu voz.",
  },
  {
    mark: "03",
    title: "Tu momento",
    text: "Cada gran conversación comienza con alguien que decide hacerla posible.",
  },
  {
    mark: "04",
    title: "Tu historia",
    text: "Las primeras reseñas verificadas de organizadores y asistentes darán vida a este espacio.",
  },
]

function ReviewCard({
  card,
  duplicate = false,
}: {
  card: typeof cards[number]
  duplicate?: boolean
}) {
  return (
    <article
      className={`review-card${duplicate ? " review-card-duplicate" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      <div className="review-card-top">
        <span className="review-avatar">{card.mark}</span>
        <span>HISTORIAS POR CREAR</span>
        <span className="review-star">✳</span>
      </div>
      <h3>{card.title}</h3>
      <p>{card.text}</p>
      <span className="review-card-bottom">RESEÑA REAL · PRÓXIMAMENTE</span>
    </article>
  )
}

export function ReviewMarquee() {
  return (
    <div
      className="reviews-marquee"
      tabIndex={0}
      role="region"
      aria-label="Espacio reservado para futuras reseñas de eventos. Enfoca el carrusel para pausar el movimiento."
    >
      <div className="marquee-column">
        <div className="marquee-track">
          {[...cards, ...cards].map((card, index) => (
            <ReviewCard
              card={card}
              duplicate={index >= cards.length}
              key={"a-" + index}
            />
          ))}
        </div>
      </div>
      <div className="marquee-column marquee-column-second" aria-hidden="true">
        <div className="marquee-track reverse">
          {[...cards.slice().reverse(), ...cards.slice().reverse()].map(
            (card, index) => (
              <ReviewCard card={card} key={"b-" + index} />
            ),
          )}
        </div>
      </div>
      <div className="marquee-fade top" />
      <div className="marquee-fade bottom" />
    </div>
  )
}
