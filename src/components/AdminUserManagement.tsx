import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Users, Key } from "lucide-react";

interface User {
  id: string;
  username: string;
  role: string;
  pin?: string;
}

const AdminUserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, role, pin')
        .eq('role', 'cozinheiro');
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(pin);
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !pin.trim()) {
      toast({
        title: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      toast({
        title: "PIN deve ter exatamente 4 dígitos",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    try {
      // Get current user's organization
      const { data: orgData, error: orgError } = await supabase
        .rpc('get_current_user_organization');
      
      if (orgError) throw orgError;

      // Create user profile directly (no auth user needed for PIN-based login)
      // Generate a UUID for the PIN-based user
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
          username: username.trim(),
          pin: pin,
          role: 'cozinheiro',
          organizacao_id: orgData
        });

      if (error) throw error;

      toast({
        title: "Cozinheiro criado com sucesso",
        description: `Usuário: ${username}, PIN: ${pin}`
      });

      // Reset form and close dialog
      setUsername("");
      setPin("");
      setIsDialogOpen(false);
      
      // Refresh users list
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando usuários...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciamento de Usuários
              </CardTitle>
              <CardDescription>
                Gerencie os cozinheiros da sua organização
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Cozinheiro
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Cozinheiro</DialogTitle>
                  <DialogDescription>
                    Crie um novo usuário cozinheiro com acesso via PIN
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={createUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de Usuário</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: jose.silva"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pin">PIN (4 dígitos)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="pin"
                        type="number"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.slice(0, 4))}
                        placeholder="1234"
                        maxLength={4}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateRandomPin}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
                        <Key className="w-4 h-4" />
                        Gerar
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={creating} className="flex-1">
                      {creating ? "Criando..." : "Criar Cozinheiro"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum cozinheiro cadastrado ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        PIN: ••••
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    Cozinheiro
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;