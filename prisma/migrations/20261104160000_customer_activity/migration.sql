CREATE TABLE favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE carts (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
  customer_name VARCHAR(80),
  email VARCHAR(254),
  phone VARCHAR(32),
  kind VARCHAR(16) NOT NULL CHECK (kind IN ('cart', 'enquiry')),
  details JSONB NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX order_inquiries_status_created_idx ON order_inquiries (status, created_at DESC);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(80) NOT NULL,
  quote VARCHAR(1000) NOT NULL,
  avatar VARCHAR(7000000) NOT NULL DEFAULT '',
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX reviews_active_created_idx ON reviews (active, created_at);

INSERT INTO reviews (name, quote, avatar, rating) VALUES
  ('Aarohi S.', 'The vintage bento cake looked exactly like the photo and tasted even better. Beautiful packaging too!', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80', 5),
  ('Meera K.', 'The custom design process was seamless. Everyone at the anniversary dinner loved the cake.', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&h=160&q=80', 5),
  ('Rohan M.', 'Fresh roses, rich brownies and delivery right on time. A genuinely premium experience.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80', 5),
  ('Naina P.', 'Not overly sweet, wonderfully soft and elegant. This is now our family celebration bakery.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80', 5);
