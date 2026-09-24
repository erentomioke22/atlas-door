// components/paymentPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Offcanvas from './ui/offcanvas';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import TextArea from './ui/TextArea';
import LoadingIcon from './ui/loading/LoadingIcon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoClose } from 'react-icons/io5';
import Input from './ui/input';
import { orderGatewayValidation } from '@/lib/validation';
import { FaCreditCard } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { useCart } from '@/hook/useCart';
import Button from './ui/button';
import type { Session } from '@/lib/auth';

interface PaymentPanelProps {
  status?: 'pending' | 'idle' | 'success' | 'error' | string;
  session: Session | null;
}

interface OrderFormValues {
  user: string;
  address: string;
  rule: 'direct' | 'gateway';
  phone: string;
  notes?: string;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  orderId?: string;
  orderCode?: string;
  error?: string;
}

const PaymentPanel: React.FC<PaymentPanelProps> = ({ status, session }) => {
  const [close, setClose] = useState(false);
  const { items, clearCart } = useCart();

  const paymentMutation = useMutation({
    mutationFn: async (values: OrderFormValues) => {
      // ✅ ارسال items از cart
      const payload = {
        user: values.user,
        phone: values.phone,
        address: values.address,
        rule: values.rule,
        notes: values.notes || '',
        items: items.map((item) => ({
          productId: item.productId,
          colorId: item.colorId,
          quantity: item.quantity,
        })),
      };

      const response = await axios.post<PaymentResponse>(
        '/api/payment',
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        clearCart();

        if (data.paymentUrl) {
          toast.success('در حال انتقال به درگاه پرداخت...');
          window.location.href = data.paymentUrl;
        } else {
          toast.success(
            'سفارش شما با موفقیت ثبت شد. همکاران ما به‌زودی با شما تماس می‌گیرند',
            { duration: 6000 }
          );
          setClose(false);
          // ✅ ریدایرکت به صفحه سفارشات
          setTimeout(() => {
            window.location.href = '/orders';
          }, 2000);
        }
      } else {
        toast.error(data.error || 'مشکلی در فرآیند پرداخت بوجود آمده است');
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error ||
          'عملیات پرداخت ناموفق بود. دوباره تلاش کنید'
      );
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrderFormValues>({
    defaultValues: { user: '', address: '', rule: 'direct', phone: '', notes: '' },
    resolver: zodResolver(orderGatewayValidation),
  });

  useEffect(() => {
    if (session) {
      setValue('user', session?.user?.name ?? '');
      setValue('address', session?.user?.address ?? '');
      setValue('phone', session?.user?.phone ?? '');
    }
  }, [session, setValue]);

  const onSubmit = (values: OrderFormValues) => {
    if (items.length === 0) {
      toast.error('سبد خرید شما خالی است');
      return;
    }
    paymentMutation.mutate(values);
  };

  return (
    <Offcanvas
      title="تکمیل سفارش"
      btnStyle="bg-black text-white dark:bg-white dark:text-black rounded-xl p-2 text-sm sm:text-lg mx-auto w-full flex justify-center"
      disabled={status === 'pending' || items.length === 0}
      position="top-0 right-0"
      size="h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard overflow-y-auto"
      openTransition="translate-x-0"
      closeTransition="translate-x-full"
      onClose={close}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="flex justify-between mb-5">
          <h1 className="text-xl">تکمیل سفارش</h1>
          <Button
            onClick={() => setClose(!close)}
            className="text-lg bg-lcard dark:bg-dcard px-2 py-1 rounded-full border-2 text-lfont"
            type="button"
            variant="close"
            title="close button"
          >
            <IoClose />
          </Button>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">مشخصات دریافت‌کننده</p>

          <Input
            placeholder="نام و نام خانوادگی"
            type="text"
            label={false}
            className="bg-lcard dark:bg-dcard rounded-lg p-2 text-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            error={errors?.user?.message}
            {...register('user')}
          />

          <Input
            placeholder="شماره تماس"
            type="tel"
            label={false}
            className="bg-lcard dark:bg-dcard rounded-lg p-2 text-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            error={errors?.phone?.message}
            {...register('phone')}
          />

          <TextArea
            placeholder="آدرس"
            label={false}
            className="resize-none bg-lcard dark:bg-dcard rounded-lg p-2 text-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            error={errors?.address?.message}
            {...register('address')}
          />

          <TextArea
            placeholder="یادداشت (اختیاری)"
            label={false}
            className="resize-none bg-lcard dark:bg-dcard rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            {...register('notes')}
          />

          <p className="text-sm font-medium">نحوه پرداخت</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                className="hidden peer"
                type="radio"
                value="gateway"
                {...register('rule')}
                id="gateway"
                disabled
              />
              <label
                className="flex flex-col py-2 px-3 text-center text-lfont bg-lcard dark:bg-dcard border-2 cursor-not-allowed rounded-xl opacity-50"
                htmlFor="gateway"
              >
                <FaCreditCard className="mx-auto" />
                <p>درگاه پرداخت</p>
                <p className="text-[10px]">(غیرفعال)</p>
              </label>
            </div>

            <div>
              <input
                className="hidden peer"
                type="radio"
                value="direct"
                {...register('rule')}
                id="direct"
              />
              <label
                className="flex flex-col py-2 px-3 text-center border-2 cursor-pointer rounded-xl duration-300 peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black"
                htmlFor="direct"
              >
                <FaLocationDot className="mx-auto" />
                <p>پرداخت در محل</p>
                <p className="text-[10px]">هنگام دریافت محصول</p>
              </label>
            </div>
          </div>

          <div className="w-full">
            <button
              type="submit"
              disabled={paymentMutation.isPending || items.length === 0}
              className="px-6 py-2 rounded-lg text-white dark:text-black w-full my-3 bg-black dark:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paymentMutation.isPending ? (
                <LoadingIcon color="bg-white dark:bg-black" />
              ) : (
                'ثبت سفارش'
              )}
            </button>
          </div>
        </div>
      </form>
    </Offcanvas>
  );
};

export default PaymentPanel;