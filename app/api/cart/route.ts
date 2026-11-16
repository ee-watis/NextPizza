import { prisma } from "@/prisma/prisma-client";
import { findOrCreateCart } from "@/shared/lib/find-or-create-cart";
import { updataCartTotalAmount } from "@/shared/lib/updata-cart-total-amount";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('cartToken')?.value;

        if(!token) {
            return NextResponse.json({totalAmount: 0, items: []});
        }

        const userCart = await prisma.cart.findFirst({
            where: {
                OR: [
                    {
                        token,
                    },
                ]
            },
            include: {
                items: {
                    orderBy: {
                        createdAt: 'desc',
                    }, 
                    include: {
                        productItem: {
                            include: {
                                product: true,
                            }
                        },
                        ingredients: true,
                    },     
                },
            },
        });

        return NextResponse.json(userCart)
    } catch (error) {
        console.log('[CART_GET] Server error', error);
        return NextResponse.json({ message: 'Не удалось получить корзину' }, { status: 500 });
        
    }
}

export async function POST(req: NextRequest) {
    try {
        let token = req.cookies.get('cartToken')?.value;

        if(!token) {
            token = crypto.randomUUID();
        }

        const userCart = await findOrCreateCart(token);
        const data = (await req.json()) as CreateCartItemValues;

        // const findCartItem = await prisma.cartItem.findFirst({
        //     where: {
        //         cartId: userCart.id,
        //         productItemId: data.productItemId,
        //         ingredients: { every: {id: { in: data.ingredients} } }
        //     }
        // })

        const cartItems = await prisma.cartItem.findMany({
            where: {
                cartId: userCart.id,
                productItemId: data.productItemId,
            },
            include: {
                ingredients: true,
            },
        });
        
        const findCartItem = cartItems.find((item) => {
            if (item.ingredients.length !== (data.ingredients?.length ?? 0)) {
                return false;
            }

            const cartItemIngredientIds = item.ingredients.map((ingredient) => ingredient.id);

            return cartItemIngredientIds.every((id) => data.ingredients?.includes(id));
        });

        if (findCartItem) {
            await prisma.cartItem.update({
                where: {
                    id: findCartItem.id,
                },
                data: {
                    quantity: findCartItem.quantity + 1,
                },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: userCart.id,
                    productItemId: data.productItemId,
                    quantity: 1, 
                    ingredients: {connect: data.ingredients?.map((id) => ({id}))},
                },
            });
        }
        

        const updatedUserCart = await updataCartTotalAmount(token);
        const response = NextResponse.json(updatedUserCart);
        response.cookies.set('cartToken', token, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
            httpOnly: true,            
            sameSite: 'lax',           
            secure: process.env.NODE_ENV === 'production',
          });        
        return response;
    } catch (error) {
        console.log('[CART_POST] Server error', error);
        return NextResponse.json({ message: 'Не удалось создать корзину' }, { status: 500 });

    }
}