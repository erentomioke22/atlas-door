// src/collections/Orders.ts
import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderCode',
  },
  fields: [
    {
      name: 'orderCode',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'recipient',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'در انتظار پرداخت', value: 'PENDING' },
        { label: 'پرداخت شده', value: 'PAID' },
        { label: 'در حال پردازش', value: 'PROCESSING' },
        { label: 'ارسال به کارخانه', value: 'SENT_TO_FACTORY' },
        { label: 'در حال تولید', value: 'IN_PRODUCTION' },
        { label: 'آماده', value: 'READY' },
        { label: 'ارسال شده', value: 'SHIPPED' },
        { label: 'تحویل شده', value: 'DELIVERED' },
        { label: 'لغو شده', value: 'CANCELLED' },
      ],
      defaultValue: 'PENDING',
    },
    {
      name: 'paymentId',
      type: 'text',
    },
    {
      name: 'paymentDate',
      type: 'date',
    },
    {
      name: 'notes',
      type: 'textarea', // یادداشت مشتری
    },
    {
      name: 'adminNote',
      type: 'textarea', // یادداشت ادمین
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'quantity', type: 'number', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'originalPrice', type: 'number' },
        { name: 'discount', type: 'number' },
        { name: 'productId', type: 'text', required: true },
        { name: 'colorId', type: 'text', required: true },
        { name: 'productName', type: 'text' },
        { name: 'productSlug', type: 'text' },
        { name: 'productImage', type: 'text' },
        { name: 'colorName', type: 'text' },
        { name: 'colorHex', type: 'text' },
      ],
    },
  ],
}