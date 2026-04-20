import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import type { ProductCategory } from '@/types/product';

type Filter = 'all' | ProductCategory;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tout' },
  { key: 'matcha', label: 'Matcha' },
  { key: 'cafe', label: 'Café' },
  { key: 'patisserie', label: 'Pâtisseries' },
  { key: 'autre', label: 'Autres' },
];

export function Menu() {
  const { products, loading } = useProducts();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = filter === 'all' || p.categorie === filter;
      const matchQuery =
        !query ||
        p.nom.toLowerCase().includes(query.toLowerCase()) ||
        (p.description ?? '').toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, filter, query]);

  return (
    <section id="menu" className="container py-20 md:py-28">
      <div className="max-w-2xl mb-12">
        <div className="text-xs uppercase tracking-[0.25em] text-matcha mb-3">Notre carte</div>
        <h2 className="font-display text-4xl md:text-6xl leading-tight text-balance">
          Une sélection pensée avec lenteur.
        </h2>
        <p className="text-muted-foreground mt-4 text-lg max-w-lg">
          Du matcha grade cérémonial aux cafés de spécialité, chaque tasse raconte une histoire.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'pill-active' : 'pill'}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 rounded-full bg-background"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-3xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Aucun produit ne correspond.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
