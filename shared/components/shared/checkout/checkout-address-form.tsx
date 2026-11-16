'use client'

import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormTextarea } from '../form-components';
import { AdressInput } from '../address-input';
import { Controller, useFormContext } from 'react-hook-form';
import { ErrorText } from '../error-text';

interface Props {
  className?: string;
  disabled?: boolean;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
  const { control } = useFormContext();
  return (
    <WhiteBlock title='3. Адрес доставки'>
      <div className='flex flex-col gap-5'>
            <Controller 
              control={control}
              name="address"
              render={({field, fieldState}) => <>
                <AdressInput value={field.value} onChange={field.onChange} />
                {fieldState.error?.message && <ErrorText text={fieldState.error.message}/>}
              </>}
              
            />
            <FormTextarea name="comment" rows={5} className='text-basic' placeholder='Коментарий к заказу'/>  
      </div>
    </WhiteBlock>


  );
};