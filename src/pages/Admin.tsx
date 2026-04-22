import { useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, LogOut, Package, Coins, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductCategory } from '@/types/product';
import { CATEGORY_LABELS } from '@/types/product';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';
import { clearAdminAuthenticated } from '@/lib/admin-auth';
import { toast } from 'sonner';

const EMPTY = {
  nom: '',
  description: '',
  prix: '',
  image_url: '',
  categorie: 'matcha' as ProductCategory,
  stock_quantite: '0',
};

export default function Admin() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const totalStockValue = products.reduce((s, p) => s + Number(p.prix) * p.stock_quantite, 0);
  const lowStockCount = products.filter((p) => p.stock_quantite > 0 && p.stock_quantite < 5).length;

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      nom: p.nom,
      description: p.description ?? '',
      prix: String(p.prix),
      image_url: p.image_url ?? '',
      categorie: p.categorie,
      stock_quantite: String(p.stock_quantite),
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      nom: form.nom.trim(),
      description: form.description.trim() || null,
      prix: Number(form.prix),
      image_url: form.image_url.trim() || null,
      categorie: form.categorie,
      stock_quantite: Number(form.stock_quantite),
    };

    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert(payload);

    setSaving(false);
    if (error) {
      toast.error("Erreur d'enregistrement");
      return;
    }
    toast.success(editing ? 'Produit mis à jour' : 'Produit ajouté');
    setDialogOpen(false);
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Supprimer "${p.nom}" ?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) toast.error('Suppression impossible');
    else toast.success('Produit supprimé');
  };

  const logout = () => {
    clearAdminAuthenticated();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-30">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-matcha flex items-center justify-center">
              <span className="font-display text-lg text-primary-foreground">M</span>
            </div>
            <div>
              <div className="font-display text-xl leading-tight">Matcha &amp; Co</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-0.5">Admin</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>Voir le site</Button>
            <Button variant="outline" size="sm" onClick={() => setPasswordOpen(true)}>
              <KeyRound className="h-4 w-4" /> Mot de passe
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">Tableau de bord</h1>
            <p className="text-muted-foreground mt-2">Gérez votre catalogue et vos stocks en temps réel.</p>
          </div>
          <Button variant="hero" size="lg" onClick={openNew}>
            <Plus className="h-5 w-5" /> Ajouter un produit
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard icon={Package} label="Produits" value={String(products.length)} />
          <StatCard icon={Coins} label="Valeur du stock" value={`${totalStockValue.toFixed(2).replace('.', ',')} €`} />
          <StatCard icon={AlertTriangle} label="Stock faible (<5)" value={String(lowStockCount)} accent={lowStockCount > 0} />
        </div>

        <div className="bg-card rounded-3xl border border-border/50 shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Prix</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Chargement…</TableCell></TableRow>
              ) : products.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Aucun produit</TableCell></TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                          {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-medium">{p.nom}</div>
                          {p.description && <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{p.description}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs uppercase tracking-wider px-2 py-1 rounded-full bg-accent text-accent-foreground">
                        {CATEGORY_LABELS[p.categorie]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{Number(p.prix).toFixed(2).replace('.', ',')} €</TableCell>
                    <TableCell className="text-right">
                      {p.stock_quantite === 0 ? (
                        <span className="px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">Rupture</span>
                      ) : p.stock_quantite < 5 ? (
                        <span className="px-2 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-medium">{p.stock_quantite} · faible</span>
                      ) : (
                        <span className="text-foreground">{p.stock_quantite}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                          <Pencil className="h-3.5 w-3.5" /> Modifier
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(p)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing ? 'Modifier le produit' : 'Nouveau produit'}
            </DialogTitle>
            <DialogDescription>
              {editing ? 'Mettez à jour les informations du produit.' : 'Ajoutez un nouveau produit au catalogue.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prix">Prix (€)</Label>
                <Input id="prix" type="number" step="0.01" min="0" required value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" min="0" required value={form.stock_quantite} onChange={(e) => setForm({ ...form, stock_quantite: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={form.categorie} onValueChange={(v) => setForm({ ...form, categorie: v as ProductCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="matcha">Matcha</SelectItem>
                  <SelectItem value="cafe">Café</SelectItem>
                  <SelectItem value="patisserie">Pâtisserie</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="img">URL de l'image</Label>
              <Input id="img" type="url" placeholder="https://…" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button type="submit" variant="hero" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof Package; label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-soft flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent ? 'bg-destructive/10 text-destructive' : 'bg-accent text-accent-foreground'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-display text-2xl">{value}</div>
      </div>
    </div>
  );
}
