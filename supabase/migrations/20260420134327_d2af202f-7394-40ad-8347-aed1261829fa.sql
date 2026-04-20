
-- Enum catégories
CREATE TYPE public.product_category AS ENUM ('matcha', 'cafe', 'patisserie', 'autre');
CREATE TYPE public.order_status AS ENUM ('en_attente', 'complete');

-- Table products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  description TEXT,
  prix NUMERIC(10,2) NOT NULL CHECK (prix >= 0),
  image_url TEXT,
  categorie public.product_category NOT NULL DEFAULT 'autre',
  stock_quantite INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantite >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_price NUMERIC(10,2) NOT NULL,
  status public.order_status NOT NULL DEFAULT 'en_attente',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Products: lecture publique, écriture publique (admin protégé côté client - MVP)
CREATE POLICY "Products viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products insert public" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products update public" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Products delete public" ON public.products FOR DELETE USING (true);

-- Orders: création publique, lecture publique
CREATE POLICY "Orders viewable by everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders insert public" ON public.orders FOR INSERT WITH CHECK (true);

-- Realtime
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
