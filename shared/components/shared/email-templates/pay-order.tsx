import React from 'react';

interface EmailTemplateProps {
  orderId: string;
  totalAmount: number;
  paymentUrl: string;
}

export function PayOrderTemplate({ orderId, totalAmount, paymentUrl }: EmailTemplateProps) {
  return (
    <div>
      <h1>Заказ #{orderId}</h1>\
      <p>Оплатите заказ на сумму {totalAmount} рублей. Перейдите <a href={paymentUrl}>по ссылке</a> для оплаты.</p>
    </div>
  );
}