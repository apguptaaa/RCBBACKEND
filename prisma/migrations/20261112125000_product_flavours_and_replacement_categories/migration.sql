ALTER TABLE products
  ADD COLUMN flavours TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN unit_type VARCHAR(16) NOT NULL DEFAULT 'weight'
    CHECK (unit_type IN ('weight', 'count'));

UPDATE products
SET flavours = ARRAY[
  'Belgian chocolate',
  'Vanilla berry',
  'Red velvet',
  'Butterscotch',
  'Fresh fruit'
]::TEXT[]
WHERE cardinality(flavours) = 0;

UPDATE products AS product
SET unit_type = 'count'
FROM categories AS category
WHERE product.category_id = category.id
  AND lower(category.name) IN ('cupcake', 'cupcakes');

UPDATE categories AS category
SET image = replacement.image,
    active = TRUE,
    deleted_at = NULL,
    updated_at = now()
FROM (VALUES
  ('Simple Cakes', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=85'),
  ('Theme Cakes', 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=500&q=85'),
  ('Designer Cakes', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=85'),
  ('Cartoon Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=85'),
  ('Pinata Cake', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=500&q=85')
) AS replacement(name, image)
WHERE lower(category.name) = lower(replacement.name);

INSERT INTO categories (id, name, image, active)
SELECT replacement.id, replacement.name, replacement.image, TRUE
FROM (VALUES
  ('simple-cakes', 'Simple Cakes', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=85'),
  ('theme-cakes', 'Theme Cakes', 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=500&q=85'),
  ('designer-cakes', 'Designer Cakes', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=85'),
  ('cartoon-cakes', 'Cartoon Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=85'),
  ('pinata-cake', 'Pinata Cake', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=500&q=85')
) AS replacement(id, name, image)
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE lower(name) = lower(replacement.name)
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    image = EXCLUDED.image,
    active = TRUE,
    deleted_at = NULL,
    updated_at = now();

UPDATE categories
SET active = FALSE, updated_at = now()
WHERE deleted_at IS NULL
  AND lower(name) NOT IN (
    'simple cakes',
    'theme cakes',
    'designer cakes',
    'cartoon cakes',
    'pinata cake'
  );
