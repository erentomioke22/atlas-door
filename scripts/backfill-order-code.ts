import { prisma } from "..utils/database";

function generateOrderCode() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `AT-${y}${m}${d}-${rand}`;
}

async function getUniqueOrderCode() {
  for (let i = 0; i < 5; i++) {
    const code = generateOrderCode();
    const exists = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!exists) return code;
  }
  return `AT-${Date.now()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
}

async function main() {
  const orders = await prisma.order.findMany({ where: { orderCode: null }, select: { id: true } });
  for (const o of orders) {
    const code = await getUniqueOrderCode();
    await prisma.order.update({ where: { id: o.id }, data: { orderCode: code } });
  }
  console.log(`Backfilled ${orders.length} orders`);
}

main().finally(async () => await prisma.$disconnect());