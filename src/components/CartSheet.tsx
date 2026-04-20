import { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { CheckoutDialog } from './CheckoutDialog';

export function CartSheet() {
  const { items, isOpen, close, setQty, remove, subtotal } = useCart();
  const total = subtotal();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : close())}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-display text-3xl text-left">Votre panier</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-3">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl">🍵</div>
            <p className="text-muted-foreground">Votre panier est vide.</p>
            <Button variant="outline" size="sm" onClick={close}>Continuer mes achats</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border/50 last:border-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.nom} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight">{item.nom}</h4>
                      <button onClick={() => remove(item.id)} aria-label="Retirer">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-smooth" />
                      </button>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.prix.toFixed(2).replace('.', ',')} €
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-border rounded-full">
                        <button
                          onClick={() => setQty(item.id, item.quantity - 1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-muted rounded-full"
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => setQty(item.id, item.quantity + 1)}
                          className="h-7 w-7 flex items-center justify-center hover:bg-muted rounded-full"
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-semibold text-matcha-deep">
                        {(item.prix * item.quantity).toFixed(2).replace('.', ',')} €
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5 space-y-4 bg-foam">
              <div className="flex justify-between items-baseline">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-display text-3xl">{total.toFixed(2).replace('.', ',')} €</span>
              </div>
              <Button variant="hero" size="lg" className="w-full" onClick={() => setCheckoutOpen(true)}>
                Commander
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé ✦ Retrait boutique ou livraison gratuite
              </p>
            </div>
          </>
        )}
      </SheetContent>
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </Sheet>
  );
}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
