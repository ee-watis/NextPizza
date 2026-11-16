import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface Props {
    amount: number;
    orderId: number;
    description: string;
}

export async function createPayment(deteils: Props) {
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}?paid=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        metadata: {
            orderId: String(deteils.orderId),
        },
        line_items: [
            {
                price_data: {
                    currency: 'uah',
                    product_data: {
                        name: `NextPizza - Заказ №${deteils.orderId}`,
                        description: deteils.description,
                    },
                    unit_amount: Math.round(deteils.amount * 100),
                },
                quantity: 1,
                
            },
        ],
    });

    return session;
}