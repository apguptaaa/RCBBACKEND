import { prisma } from '../db/client.js';
import type { PromoClaimInput } from '../validators/promo.validator.js';

export async function claimPromo(input: PromoClaimInput) {
  const claim = await prisma.promoClaim.upsert({
    where: { phone: input.phone },
    create: input,
    update: {},
    select: { id: true, phone: true, offer: true, createdAt: true }
  });

  return {
    id: claim.id,
    phone: claim.phone,
    offer: claim.offer,
    created_at: claim.createdAt
  };
}
