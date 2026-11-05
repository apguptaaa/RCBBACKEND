import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import catalogRoutes from './routes/catalog.routes.js';
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import subcategoriesRoutes from './routes/subcategories.routes.js';
import addonsRoutes from './routes/addons.routes.js';
import bannersRoutes from './routes/banners.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import customOrdersRoutes from './routes/custom-orders.routes.js';
import adminCustomOrdersRoutes from './routes/admin-custom-orders.routes.js';
import accountRoutes from './routes/account.routes.js';
import orderInquiriesRoutes from './routes/order-inquiries.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import adminReviewsRoutes from './routes/admin-reviews.routes.js';
import errorHandler from './middleware/errorHandler.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import healthRoutes from './routes/health.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '8mb' }));
app.use('/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', catalogRoutes);
app.use('/api/v1/admin/products', productsRoutes);
app.use('/api/v1/admin/categories', categoriesRoutes);
app.use('/api/v1/admin/subcategories', subcategoriesRoutes);
app.use('/api/v1/admin/addons', addonsRoutes);
app.use('/api/v1/admin/banners', bannersRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
app.use('/api/v1/custom-orders', customOrdersRoutes);
app.use('/api/v1/admin/custom-orders', adminCustomOrdersRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/order-inquiries', orderInquiriesRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/admin/reviews', adminReviewsRoutes);
app.use('/api/v1/admin/uploads', uploadsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
