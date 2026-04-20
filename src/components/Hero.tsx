import { Button } from '@/components/ui/button';
import heroImg from '@/assets/hero-matcha.jpg';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="container grid md:grid-cols-2 gap-12 items-center py-20 md:py-28">
        <div className="space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/60 border border-border text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-matcha animate-pulse" />
            Ouvert · 7j/7
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-balance">
            Le meilleur du <em className="text-matcha">Matcha</em> &amp; du <em className="text-coffee">Café</em>{' '}
            dans votre tasse.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md text-balance">
            Une parenthèse zen au cœur de la ville. Matcha cérémonial, cafés de spécialité et pâtisseries maison.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="xl" asChild>
              <a href="#menu">Voir le menu</a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#contact">Nous trouver</a>
            </Button>
          </div>
          <div className="flex gap-8 pt-4 text-sm">
            <div>
              <div className="font-display text-3xl text-foreground">10+</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">Boissons signature</div>
            </div>
            <div className="border-l border-border pl-8">
              <div className="font-display text-3xl text-foreground">100%</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">Cérémonial Japon</div>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="absolute -inset-4 bg-matcha rounded-[2rem] opacity-20 blur-3xl" />
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-warm">
            <img
              src={heroImg}
              alt="Latte au matcha avec mousse veloutée dans une tasse en céramique artisanale"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-foam rounded-2xl p-4 shadow-soft border border-border max-w-[180px]">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Aujourd'hui</div>
            <div className="font-display text-lg leading-tight">Matcha Latte cérémonial</div>
            <div className="text-matcha font-semibold mt-1">6,00 €</div>
          </div>
        </div>
      </div>
    </section>
  );
}
