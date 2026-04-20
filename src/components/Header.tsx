import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';

export function Header() {
  const count = useCart((s) => s.count());
  const open = useCart((s) => s.open);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-matcha flex items-center justify-center shadow-matcha transition-smooth group-hover:scale-110">
            <span className="font-display text-xl text-primary-foreground">M</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-2xl">Matcha &amp; Co</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">café · zen</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#menu" className="hover:text-primary transition-smooth">Menu</a>
          <a href="#about" className="hover:text-primary transition-smooth">À propos</a>
          <a href="#contact" className="hover:text-primary transition-smooth">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={open} aria-label="Ouvrir le panier" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
