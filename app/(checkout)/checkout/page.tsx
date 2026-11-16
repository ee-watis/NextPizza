'use client'

import { CheckoutSidebar, Container, Title } from '@/shared/components/shared';
import { useCart } from '@/shared/hooks';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutAddressForm, CheckoutCart, CheckoutPersonalForm } from '@/shared/components/shared/checkout';
import { checkoutFormSchema, CheckoutFormValues } from '@/shared/constants/checkout-form-schema';
import { cn } from '@/shared/lib/utils';
import { createOrder } from '@/app/action';
import toast from 'react-hot-toast';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Api } from '@/shared/services/api-client';


export default function CheckoutPage() {
  const { totalAmount, updateItemQuantity, items, removeCartItem, loading } = useCart();
  const [submiting, setSubmiting] = React.useState(false);
  const session = useSession();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      comment: '',
    },
  })

  useEffect(() => {
    async function fetchUserInfo() {
      const data = await Api.auth.getMe();
      const [firstName, lastName] = data.fullName.split(' ');

      form.setValue('firstName', firstName);
      form.setValue('lastName', lastName);
      form.setValue('email', data.email);
    }

    if (session) {
      fetchUserInfo();
    }
  }, [session]);
  const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmiting(true);
      const url = await createOrder(data);
      toast.success('Заказ успішно створено', { icon: '🎉' });

      if (url) {
        window.location.assign(url);
      }
      
    } catch (error) {
      setSubmiting(false);
      console.log(error);
      toast.error('Проблема з заказом', {icon: '😭'});
    }
      
  }

  return (
    <Container className='mt-5'>
      <Title text='Оформление заказа' className='font-extrebold mb-8 text-[46px]'/>
      
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex gap-10'>
            <div className='flex flex-col gap-10 flex-1 mb-20'>

              <CheckoutCart onClickCountButton={onClickCountButton} removeCartItem={removeCartItem} items={items} loading={loading}/>
              <CheckoutPersonalForm className={cn({ 'opacity-50 pointer-events-none': loading })} />              
              <CheckoutAddressForm className={cn({ 'opacity-50 pointer-events-none': loading })}/>

              
            </div>

            <div className='w-[450px]'>
              <CheckoutSidebar totalAmount={totalAmount} loading={loading || submiting}/>
            </div>
          </div>
      
        </form>
      </FormProvider>
    </Container>
  );
};