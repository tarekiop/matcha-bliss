import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { checkAdminCredentials, setAdminAuthenticated } from '@/lib/admin-auth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (checkAdminCredentials(username, password)) {
      setAdminAuthenticated();
      navigate('/admin');
    } else {
      toast.error('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-card rounded-3xl shadow-warm p-8 space-y-6 border border-border/50"
      >
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-matcha mx-auto flex items-center justify-center shadow-matcha">
            <span className="font-display text-2xl text-primary-foreground">M</span>
          </div>
          <h1 className="font-display text-3xl">Espace gérant</h1>
          <p className="text-sm text-muted-foreground">Connectez-vous pour gérer la boutique.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="u">Identifiant</Label>
            <Input id="u" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="p">Mot de passe</Label>
            <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          </div>
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full">Se connecter</Button>
        <p className="text-xs text-center text-muted-foreground">Démo : admin / admin</p>
      </form>
    </div>
  );
}
