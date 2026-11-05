import { prisma } from '../db/client.js';
import type { CustomOrderInput } from '../validators/custom-order.validator.js';
import type { NewsletterInput } from '../validators/newsletter.validator.js';

export async function subscribe(input: NewsletterInput): Promise<void> {
  await prisma.newsletterSubscriber.upsert({
    where: { email: input.email },
    create: { email: input.email },
    update: {}
  });
}

export async function createCustomOrder(input: CustomOrderInput) {
  const order = await prisma.customOrder.create({
    data: {
      customerName: input.customer_name,
      email: input.email,
      phone: input.phone,
      occasion: input.occasion,
      flavour: input.flavour,
      servingSize: input.serving_size,
      celebrationDate: new Date(`${input.celebration_date}T00:00:00.000Z`),
      designIdea: input.design_idea
    },
    select: { id: true, status: true, createdAt: true }
  });
  return { id: order.id, status: order.status, created_at: order.createdAt };
}

export async function listCustomOrders() {
  const orders = await prisma.customOrder.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200
  });
  return orders.map((order) => ({
    id: order.id,
    customer_name: order.customerName,
    email: order.email,
    phone: order.phone,
    occasion: order.occasion,
    flavour: order.flavour,
    serving_size: order.servingSize,
    celebration_date: order.celebrationDate,
    design_idea: order.designIdea,
    status: order.status,
    created_at: order.createdAt
  }));
}

export async function updateCustomOrderStatus(id: string, status: string) {
  return prisma.customOrder.update({
    where: { id },
    data: { status },
    select: { id: true, status: true }
  });
}
