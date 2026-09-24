/** Faixa tipográfica que se move com o scroll. */
export default function TechMarquee() {
  return (
    <div className="tech-marquee" id="techMarquee">
      <span className="manuals-sr-only">
        Energia, movimento, tecnologia, inovação, potência, conexão, evolução, autonomia.
      </span>
      <div className="tech-marquee-track" id="techMarqueeTrack" aria-hidden="true">
        <span className="tech-marquee-phrase">
          <span className="tech-marquee-accent">ENERGIA</span> • MOVIMENTO • TECNOLOGIA • INOVAÇÃO • POTÊNCIA
          • CONEXÃO • EVOLUÇÃO • AUTONOMIA •
        </span>{' '}
        <span className="tech-marquee-phrase">
          <span className="tech-marquee-accent">ENERGIA</span> • MOVIMENTO • TECNOLOGIA • INOVAÇÃO • POTÊNCIA
          • CONEXÃO • EVOLUÇÃO • AUTONOMIA •
        </span>
      </div>
    </div>
  );
}
