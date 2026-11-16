import React from 'react';
import { WhiteBlock } from '../white-block';
import { FormInput } from '../form-components';

interface Props {
  className?: string;
  disabled?: boolean;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title='2. Персональні дані'>
              <div className='grid grid-cols-2 gap-5'>
                <FormInput name="lastName" className="text-base" placeholder="Фамилия" />
                <FormInput name="email" className="text-base" placeholder="E-Mail" />
                <FormInput name="phone" className="text-base" placeholder="Телефон" />
                <FormInput name="firstName" className="text-base" placeholder="Имя" />
              </div>
            </WhiteBlock>
  );
};