/** Faixa tipográfica inclinada que corre sozinha. */
export default function TechMarquee() {
  return (
    <div className="tech-marquee" id="techMarquee">
      <span className="manuals-sr-only">
        Energia, movimento, tecnologia, inovação, potência, conexão, evolução, autonomia.
      </span>
      <div className="tech-marquee-band" aria-hidden="true">
        <div className="tech-marquee-track" id="techMarqueeTrack">
          <span className="tech-marquee-phrase">
            <span className="tech-marquee-accent">ENERGIA</span> • MOVIMENTO • TECNOLOGIA • INOVAÇÃO •
            POTÊNCIA • CONEXÃO • EVOLUÇÃO • AUTONOMIA •
          </span>{' '}
          <span className="tech-marquee-phrase">
            <span className="tech-marquee-accent">ENERGIA</span> • MOVIMENTO • TECNOLOGIA • INOVAÇÃO •
            POTÊNCIA • CONEXÃO • EVOLUÇÃO • AUTONOMIA •
          </span>{' '}
          <span className="tech-marquee-phrase">
            <span className="tech-marquee-accent">ENERGIA</span> • MOVIMENTO • TECNOLOGIA • INOVAÇÃO •
            POTÊNCIA • CONEXÃO • EVOLUÇÃO • AUTONOMIA •
          </span>{' '}
          <span className="tech-marquee-phrase">
            <span className="tech-marquee-accent">ENERGIA</span> • MOVIMENTO • TECNOLOGIA • INOVAÇÃO •
            POTÊNCIA • CONEXÃO • EVOLUÇÃO • AUTONOMIA •
          </span>
        </div>
      </div>
    </div>
  );
}
