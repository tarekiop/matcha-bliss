import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import type { Product } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import { toast } from 'sonner';

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const outOfStock = product.stock_quantite <= 0;

  const handleAdd = () => {
    add(product);
    toast.success(`${product.nom} ajouté au panier`);
  };

  return (
    <article className="group relative bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-warm transition-smooth hover:-translate-y-1 border border-border/50">
      <div className="aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.nom}
            loading="lazy"
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">—</div>
        )}
        {outOfStock && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
            Rupture de stock
          </div>
        )}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-medium uppercase tracking-wider">
          {CATEGORY_LABELS[product.categorie]}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-display text-2xl leading-tight">{product.nom}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="font-display text-2xl text-matcha-deep">
            {Number(product.prix).toFixed(2).replace('.', ',')} €
          </div>
          <Button
            size="sm"
            variant="hero"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Ajouter ${product.nom} au panier`}
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </article>
  );
}
