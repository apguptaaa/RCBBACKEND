import { prisma } from '../db/client.js';
import type { OrderInquiryInput } from '../validators/order-inquiry.validator.js';

export async function createOrderInquiry(input: OrderInquiryInput) {
  const inquiry = await prisma.orderInquiry.create({
    data: {
      kind: input.kind,
      customerName: input.customer_name || null,
      details: input.details
    },
    select: { id: true, status: true, createdAt: true }
  });
  return { id: inquiry.id, status: inquiry.status, created_at: inquiry.createdAt };
}

export async function listOrderInquiries() {
  const inquiries = await prisma.orderInquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  return inquiries.map((inquiry) => ({
    id: inquiry.id,
    kind: inquiry.kind,
    customer_name: inquiry.customerName,
    details: inquiry.details,
    status: inquiry.status,
    created_at: inquiry.createdAt
  }));
}

export async function updateOrderInquiryStatus(id: string, status: string) {
  return prisma.orderInquiry.update({
    where: { id },
    data: { status },
    select: { id: true, status: true }
  });
}
