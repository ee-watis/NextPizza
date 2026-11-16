import { prisma } from "@/prisma/prisma-client";
import { OrderSuccessTemplate } from "@/shared/components/shared";
import { sendEmail } from "@/shared/lib";
import { CartItemDTO } from "@/shared/services/dto/cart.dto";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as Stripe.CheckoutSessionCompletedEvent;

        const isSucceeded = body.type === 'checkout.session.completed';

        const orderId = Number(body.data?.object?.metadata?.orderId);
        if (!orderId) {
            return NextResponse.json({error: 'Order ID not found'});
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            },
        });

        
        if (!order) {
            return NextResponse.json({error: 'Order not found'});
        }

        await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
            }
        });

        const items = JSON.parse(order.items as string) as CartItemDTO[];

        if (isSucceeded) {
            await sendEmail(
              order.email,
              'Next Pizza / Ваш заказ успешно оформлен 🎉',
              OrderSuccessTemplate({ orderId: order.id, items }),
            );
            return NextResponse.json({ success: true });
        } else {
            // Письмо о неуспешной оплате
        }
    } catch (error) {
        console.log('[Checkout Callback] Error:', error);
        return NextResponse.json({ error: 'Server error' });
    }
}