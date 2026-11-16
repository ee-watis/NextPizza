import { z } from 'zod';

export const checkoutFormSchema = z.object({
    firstName: z.string().min(2, { message: 'Ім\'я не може бути коротким 2-х символів' }).max(50, { message: 'Поле не може бути довшим 50 символів' }),
    lastName: z.string().min(2, { message: 'Прізвище не може бути коротким 2-х символів' }).max(50, { message: 'Поле не може бути довшим 50 символів' }),
    email: z.string().email({ message: 'Введіть коректну пошту' }),
    phone: z.string().length(10, { message: 'Введіть коректний номер телефону' }),
    address: z.string().min(5, { message: 'Введіть коректний адрес' }),
    comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;    