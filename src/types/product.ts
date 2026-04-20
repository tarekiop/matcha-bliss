export type ProductCategory = 'matcha' | 'cafe' | 'patisserie' | 'autre';

export interface Product {
  id: string;
  nom: string;
  description: string | null;
  prix: number;
  image_url: string | null;
  categorie: ProductCategory;
  stock_quantite: number;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  matcha: 'Matcha',
  cafe: 'Café',
  patisserie: 'Pâtisserie',
  autre: 'Autre',
};
