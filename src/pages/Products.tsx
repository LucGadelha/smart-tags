import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFoodData } from "@/hooks/useFoodData";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Package, Search } from "lucide-react";
import { Product } from "@/types/food";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Products = () => {
  const { products, addProduct } = useFoodData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    defaultValidityDays: 1,
    department: '',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.department) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e departamento.",
        variant: "destructive",
      });
      return;
    }

    addProduct(newProduct);
    toast({
      title: "Produto adicionado",
      description: `${newProduct.name} foi adicionado com sucesso!`,
    });

    setNewProduct({ name: '', defaultValidityDays: 1, department: '' });
    setIsDialogOpen(false);
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Cozinha Quente': 'bg-red-100 text-red-800',
      'Cozinha Fria': 'bg-blue-100 text-blue-800',
      'Açougue': 'bg-purple-100 text-purple-800',
      'Padaria': 'bg-yellow-100 text-yellow-800',
      'Confeitaria': 'bg-pink-100 text-pink-800',
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Produtos</h1>
        </div>

        {/* Search and Add */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Buscar Produtos</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por nome ou departamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="kitchen" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Produto</DialogTitle>
                    <DialogDescription>
                      Configure um novo produto para agilizar a criação de etiquetas.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Produto *</Label>
                      <Input
                        id="name"
                        placeholder="Ex: Molho de Tomate"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento *</Label>
                      <Input
                        id="department"
                        placeholder="Ex: Cozinha Quente"
                        value={newProduct.department}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validity">Validade Padrão (dias) *</Label>
                      <Input
                        id="validity"
                        type="number"
                        min="1"
                        max="30"
                        value={newProduct.defaultValidityDays}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, defaultValidityDays: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddProduct} variant="kitchen">
                      Adicionar Produto
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredProducts.length} produto(s) encontrado(s)
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground">
                {searchTerm 
                  ? 'Nenhum produto encontrado com o termo pesquisado.' 
                  : 'Nenhum produto cadastrado ainda.'}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {product.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Departamento:</span>
                      <Badge className={getDepartmentColor(product.department)}>
                        {product.department}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Validade padrão:</span>
                      <span className="text-sm font-medium">
                        {product.defaultValidityDays} {product.defaultValidityDays === 1 ? 'dia' : 'dias'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Criado em:</span>
                      <span className="text-sm">
                        {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/nova-etiqueta', { state: { selectedProduct: product.name } })}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Etiqueta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;