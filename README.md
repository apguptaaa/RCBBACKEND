# RCB Backend

TypeScript/Express API for the RCBPRO storefront. PostgreSQL credentials and signing secrets are read only from environment variables; never commit a real `.env` file.

The source is split by responsibility: `routes/`, `controllers/`, and `validators/` each have separate files by domain. `services/` owns database operations through Prisma, `models/` defines API/domain records, and `prisma/` contains the ORM schema, migrations, and seed script.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to the rotated Neon connection string, `JWT_SECRET` to a random secret of at least 32 characters, and `CORS_ORIGIN` to the frontend origin.
3. Configure the initial administrator using `ADMIN_EMAIL` and a bcrypt `ADMIN_PASSWORD_HASH`. For example, with `ADMIN_PASSWORD` temporarily set in the local shell:

   ```powershell
   node --input-type=module -e "import bcrypt from 'bcryptjs'; console.log(await bcrypt.hash(process.env.ADMIN_PASSWORD, 12))"
   ```

   Put the resulting hash in `.env`, then remove the temporary `ADMIN_PASSWORD` environment variable. Do not use the former demo credentials.
4. Generate the ORM client and set up the database.

   For a **new, empty database**:

   ```powershell
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

   For the **existing Neon database** already initialized by the previous SQL migration, do not run the initial migration again. Mark it as the Prisma baseline once, then seed the administrator:

   ```powershell
   npm run db:generate
   npm run db:baseline
   npm run db:seed
   ```

   `db:baseline` records the original schema as applied; it does not recreate or delete tables. Run `npm run db:migrate` after baselining to apply later additive migrations (including customer carts, favorites, and order inquiries). Prisma migrations are recorded in `_prisma_migrations`. The configured admin is inserted if absent; rerunning the seed does not reset an existing admin password.
5. Start the API with `npm run dev`. Start only one backend instance per port. If port 3000 is already in use, stop the existing backend with `Ctrl+C` in its terminal, or choose another port in PowerShell with `$env:PORT=3001; npm run dev`. The Angular dev server in `..\RCBPRO` proxies `/api` to port 3000 by default.

To open Prisma Studio, first make sure `DATABASE_URL` is set in `RCBBACKEND\.env`, then run `npx prisma studio` from `RCBBACKEND`.

## API

All application endpoints use `/api/v1`; JSON validation errors return HTTP 400 with field details.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | Public | API and PostgreSQL readiness check |
| POST | `/api/v1/auth/register` | Public | Create customer account |
| POST | `/api/v1/auth/login` | Public, rate-limited | Sign in |
| GET | `/api/v1/auth/me` | Signed in | Read current account |
| GET | `/api/v1/catalog` | Public | Active products, categories, subcategories, add-ons and banners |
| GET | `/api/v1/admin/catalog` | Admin | Full catalog for the dashboard |
| POST/PUT/DELETE | `/api/v1/admin/products` | Admin | Product CRUD (`/:id` for update/delete) |
| POST/PUT/DELETE | `/api/v1/admin/categories` | Admin | Category CRUD (`/:id` for update/delete) |
| POST/PUT/DELETE | `/api/v1/admin/subcategories` | Admin | Subcategory CRUD (`/:id` for update/delete) |
| POST/PUT/DELETE | `/api/v1/admin/addons` | Admin | Add-on CRUD (`/:id` for update/delete) |
| POST/PUT/DELETE | `/api/v1/admin/banners` | Admin | Banner CRUD (`/:id` for update/delete) |
| POST | `/api/v1/newsletter` | Public | Subscribe an email address |
| POST | `/api/v1/custom-orders` | Public | Submit a cake consultation request |
| GET | `/api/v1/admin/custom-orders` | Admin | List recent custom-order requests |
| PATCH | `/api/v1/admin/custom-orders/:id/status` | Admin | Update request status |
| GET/PUT | `/api/v1/account/cart` | Signed in | Read or save the account's cart |
| GET/PUT | `/api/v1/account/favorites` | Signed in | Read or save favorite product IDs |
| POST | `/api/v1/order-inquiries` | Public | Save a cart checkout or WhatsApp cake enquiry before opening WhatsApp |
| GET | `/api/v1/order-inquiries` | Admin | List customer requests in the dashboard |
| PATCH | `/api/v1/order-inquiries/:id/status` | Admin | Update a customer request status |
| GET | `/api/v1/reviews` | Public | List published customer reviews |
| GET | `/api/v1/admin/reviews` | Admin | List reviews, including hidden reviews |
| POST/PUT/DELETE | `/api/v1/admin/reviews` | Admin | Create, update, and delete customer reviews (`/:id` for update/delete) |

Admin endpoints require a bearer token issued at login and verify the administrator role server-side. Passwords are stored as bcrypt hashes. Database reads and writes use Prisma Client; category/product and request data are validated before persistence.

The WhatsApp cart request records a customer-provided price snapshot for follow-up only; WhatsApp remains the confirmation channel and this is not a payment/order settlement API. Review entries are seeded from the existing storefront testimonials and can be edited or unpublished by an administrator.
