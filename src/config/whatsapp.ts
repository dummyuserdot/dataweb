import { formatCurrency } from '../data/watches';

// International format without +, spaces, or dashes
export const WHATSAPP_BUSINESS_NUMBER = '41225550194';

export interface WhatsAppOrderItem {
  name: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface WhatsAppCustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
  instructions?: string;
}

export interface WhatsAppOrderPayload {
  orderId: string;
  orderDateTime: string;
  customer: WhatsAppCustomerDetails;
  items: WhatsAppOrderItem[];
  totalItems: number;
  subtotal: number;
  promoCode?: string | null;
  promoDiscount: number;
  grandTotal: number;
}

export function generateWatchOrderId(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `#WATCH${randomDigits}`;
}

export function buildWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const lines: string[] = [
    'NEW WATCH ORDER',
    '',
    `Order ID: ${payload.orderId}`,
    `Date & Time: ${payload.orderDateTime}`,
    '',
    'CUSTOMER DETAILS:',
    `Name: ${payload.customer.fullName.trim()}`,
    `Phone: ${payload.customer.phone.trim()}`,
  ];

  if (payload.customer.email?.trim()) {
    lines.push(`Email: ${payload.customer.email.trim()}`);
  }

  lines.push(
    '',
    'DELIVERY ADDRESS:',
    payload.customer.address.trim(),
    `City: ${payload.customer.city.trim()}`,
  );

  if (payload.customer.postalCode?.trim()) {
    lines.push(`Postal Code: ${payload.customer.postalCode.trim()}`);
  }

  lines.push('', 'ORDER DETAILS:');

  payload.items.forEach((item, index) => {
    lines.push(
      '',
      `${index + 1}. ${item.name} (${item.variantName})`,
      `Price: ${formatCurrency(item.unitPrice)}`,
      `Quantity: ${item.quantity}`,
      `Subtotal: ${formatCurrency(item.subtotal)}`,
    );
  });

  lines.push(
    '',
    'ORDER SUMMARY:',
    `Total Items: ${payload.totalItems}`,
    `Subtotal: ${formatCurrency(payload.subtotal)}`,
  );

  if (payload.promoDiscount > 0) {
    lines.push(
      `Privilege Discount (${payload.promoCode ?? 'PROMO'}): -${formatCurrency(payload.promoDiscount)}`,
    );
  }

  lines.push(`Grand Total: ${formatCurrency(payload.grandTotal)}`);

  if (payload.customer.instructions?.trim()) {
    lines.push('', `Additional Instructions: ${payload.customer.instructions.trim()}`);
  }

  lines.push('', 'Thank you!');

  return lines.join('\n');
}

export function buildWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
  const message = buildWhatsAppOrderMessage(payload);
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;
}
