import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const HOURS = [
  { day: 'Lundi – Vendredi', time: '07h30 – 19h00' },
  { day: 'Samedi', time: '08h30 – 20h00' },
  { day: 'Dimanche', time: '09h00 – 18h00' },
];

export function Contact() {
  return (
    <section id="contact" className="bg-coffee text-secondary-foreground">
      <div className="container py-20 md:py-28 grid md:grid-cols-2 gap-12">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary-foreground/70 mb-3">Nous trouver</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight mb-8 text-balance">
            Venez prendre une pause avec nous.
          </h2>

          <div className="space-y-5 text-base">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-primary-glow" />
              <div>
                <div className="font-medium">70 Rue Germaine Tillion</div>
                <div className="text-secondary-foreground/70">92700 Colombes, France</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 mt-0.5 shrink-0 text-primary-glow" />
              <a href="tel:+33145678901" className="hover:underline">+33 1 45 67 89 01</a>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 mt-0.5 shrink-0 text-primary-glow" />
              <a href="mailto:hello@matcha-co.fr" className="hover:underline">hello@matcha-co.fr</a>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 mt-0.5 shrink-0 text-primary-glow" />
              <ul className="space-y-1">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex gap-4">
                    <span className="font-medium min-w-[160px]">{h.day}</span>
                    <span className="text-secondary-foreground/80">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-warm aspect-square md:aspect-auto md:min-h-[400px]">
          <iframe
            title="Carte Matcha & Co"
            src="https://www.openstreetmap.org/export/embed.html?bbox=2.3700%2C48.8540%2C2.3900%2C48.8640&layer=mapnik&marker=48.8590%2C2.3800"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between text-xs text-secondary-foreground/60">
          <div>© {new Date().getFullYear()} Matcha &amp; Co. Tous droits réservés.</div>
          <a href="/admin" className="hover:text-primary-glow transition-smooth">Espace gérant</a>
        </div>
      </div>
    </section>
  );
}
