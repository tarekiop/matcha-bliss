import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Home, CreditCard } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/store/cart';

type Mode = 'pickup' | 'delivery';

const baseSchema = z.object({
  email: z.string().trim().email({ message: 'Email invalide' }).max(255),
  cardNumber: z.string().trim().regex(/^\d{16}$/, { message: 'Numéro de carte (16 chiffres)' }),
  cardExpiry: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Format MM/AA' }),
  cardCvc: z.string().trim().regex(/^\d{3,4}$/, { message: 'CVC invalide' }),
  cardName: z.string().trim().min(2, { message: 'Nom requis' }).max(100),
});

const deliverySchema = baseSchema.extend({
  phone: z.string().trim().regex(/^[+0-9\s().-]{8,20}$/, { message: 'Téléphone invalide' }),
  address: z.string().trim().min(5, { message: 'Adresse requise' }).max(300),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function CheckoutDialog({ open, onOpenChange }: Props) {
  const { items, subtotal, clear, close } = useCart();
  const total = subtotal();
  const [mode, setMode] = useState<Mode>('pickup');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const schema = mode === 'delivery' ? deliverySchema : baseSchema;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
      toast.error(first ?? 'Formulaire invalide');
      return;
    }

    setLoading(true);
    // Simulation paiement (aucune donnée carte n'est stockée)
    await new Promise((r) => setTimeout(r, 900));

    const { error } = await supabase.from('orders').insert({
      total_price: total,
      items: items.map((i) => ({ id: i.id, nom: i.nom, prix: i.prix, quantity: i.quantity })),
      customer_email: form.email,
      fulfillment: mode,
      customer_phone: mode === 'delivery' ? form.phone : null,
      delivery_address: mode === 'delivery' ? form.address : null,
    });

    setLoading(false);
    if (error) {
      toast.error('Impossible de finaliser la commande');
      return;
    }
    toast.success(
      mode === 'delivery'
        ? 'Paiement validé ! Votre commande sera livrée 🚲'
        : 'Paiement validé ! Commande à retirer en boutique 🍵',
    );
    clear();
    onOpenChange(false);
    close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">Finaliser la commande</DialogTitle>
          <DialogDescription>
            Total à payer&nbsp;: <span className="font-semibold text-matcha-deep">{total.toFixed(2).replace('.', ',')} €</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mode */}
          <div>
            <Label className="text-sm">Mode de récupération</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setMode('pickup')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-smooth ${
                  mode === 'pickup' ? 'border-matcha bg-matcha/10' : 'border-border hover:border-matcha/50'
                }`}
              >
                <Store className="h-6 w-6 text-matcha-deep" />
                <span className="text-sm font-medium">Retrait en boutique</span>
                <span className="text-xs text-muted-foreground">Gratuit</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('delivery')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-smooth ${
                  mode === 'delivery' ? 'border-matcha bg-matcha/10' : 'border-border hover:border-matcha/50'
                }`}
              >
                <Home className="h-6 w-6 text-matcha-deep" />
                <span className="text-sm font-medium">Livraison maison</span>
                <span className="text-xs text-muted-foreground">Gratuit</span>
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email (pour la facture) *</Label>
            <Input id="email" type="email" required value={form.email} onChange={update('email')} placeholder="vous@exemple.com" />
          </div>

          {/* Delivery infos */}
          {mode === 'delivery' && (
            <div className="space-y-3 p-4 rounded-2xl bg-foam">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input id="phone" required value={form.phone} onChange={update('phone')} placeholder="+33 6 12 34 56 78" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Adresse postale complète *</Label>
                <Input id="address" required value={form.address} onChange={update('address')} placeholder="N°, rue, code postal, ville" />
              </div>
            </div>
          )}

          {/* Carte */}
          <div className="space-y-3 p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4 text-matcha-deep" /> Paiement par carte
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cardName">Nom sur la carte</Label>
              <Input id="cardName" required value={form.cardName} onChange={update('cardName')} placeholder="Jean Dupont" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                id="cardNumber"
                required
                inputMode="numeric"
                maxLength={16}
                value={form.cardNumber}
                onChange={update('cardNumber')}
                placeholder="4242 4242 4242 4242"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cardExpiry">Expiration</Label>
                <Input id="cardExpiry" required maxLength={5} value={form.cardExpiry} onChange={update('cardExpiry')} placeholder="MM/AA" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cardCvc">CVC</Label>
                <Input id="cardCvc" required maxLength={4} value={form.cardCvc} onChange={update('cardCvc')} placeholder="123" />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              ⚠️ Démo : aucune donnée bancaire n'est stockée ni transmise. Pour des paiements réels, activez Stripe.
            </p>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Traitement…' : `Payer ${total.toFixed(2).replace('.', ',')} €`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
