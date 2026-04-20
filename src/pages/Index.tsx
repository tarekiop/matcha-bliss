import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Menu } from '@/components/Menu';
import { Contact } from '@/components/Contact';
import { CartSheet } from '@/components/CartSheet';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <section id="about" className="container py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.25em] text-matcha">À propos</div>
            <h2 className="font-display text-4xl md:text-6xl leading-tight text-balance">
              Une cérémonie. Chaque tasse.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Inspirés par la lenteur du rituel japonais et la précision du café de spécialité, nous sélectionnons
              chaque grain et chaque feuille avec soin. Nos pâtisseries sont préparées chaque matin sur place.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { n: '2026', l: 'Fondé' },
                { n: 'Uji', l: 'Origine matcha' },
                { n: 'Bio', l: 'Pâtisseries' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl">{s.n}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/5] rounded-3xl bg-matcha shadow-matcha relative overflow-hidden">
            <div className="absolute inset-0 flex items-end p-8">
              <blockquote className="font-display text-2xl md:text-3xl text-primary-foreground italic leading-snug">
                « La simplicité, c'est la sophistication suprême. »
              </blockquote>
            </div>
          </div>
        </section>
        <Menu />
        <Contact />
      </main>
      <CartSheet />
    </div>
  );
};

export default Index;
