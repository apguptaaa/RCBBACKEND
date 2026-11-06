CREATE TABLE promo_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(10) NOT NULL UNIQUE,
  offer VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
