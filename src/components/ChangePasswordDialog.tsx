import { useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getAdminPassword, setAdminPassword } from '@/lib/admin-auth';

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const reset = () => {
    setCurrent('');
    setNext('');
    setConfirm('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (current !== getAdminPassword()) {
      toast.error('Mot de passe actuel incorrect');
      return;
    }
    if (next.length < 4) {
      toast.error('Le nouveau mot de passe doit contenir au moins 4 caractères');
      return;
    }
    if (next !== confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setAdminPassword(next);
    toast.success('Mot de passe mis à jour');
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Changer le mot de passe</DialogTitle>
          <DialogDescription>
            Le nouveau mot de passe sera utilisé lors de votre prochaine connexion.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Mot de passe actuel</Label>
            <Input
              id="current"
              type="password"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next">Nouveau mot de passe</Label>
            <Input
              id="next"
              type="password"
              required
              minLength={4}
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirm"
              type="password"
              required
              minLength={4}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" variant="hero">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
