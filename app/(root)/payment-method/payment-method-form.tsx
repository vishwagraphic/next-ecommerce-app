'use client'
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import { paymentMethodSchema } from "@/lib/validators";

import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";

import {zodResolver} from '@hookform/resolvers/zod'
import {Controller, FormProvider, useForm, SubmitHandler} from 'react-hook-form'
import z from 'zod'
import { Field, FieldLabel, FieldContent } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader } from 'lucide-react'
import { updateUserPaymentMethod} from '@/lib/actions/user.actions'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


const PaymentMethodForm = ({preferredPaymentMethod} : {preferredPaymentMethod: string | null}) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD
        }
    });

    const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (data:any) => {
        startTransition(async () => {
            try {
                
                console.log(data);
                const res = await updateUserPaymentMethod(data);
                console.log(res);
                 if (!res.success) {
                     toast.error(<div className="bg-red-100 text-red-800 p-4 rounded-md">
                        {res.message}
                     </div>)
                     return;
                }
                toast.success("Payment method updated successfully");
                router.push("/place-order");
            } catch (error) {
                console.error(error);
            }
        });
    };

    return (
        <>
             <div className="max-w-md mx-auto space-y-4">
                <h1 className="h2-bold mt-4">Payment Method</h1>
                <p className="text-sm text-muted-foreground">
                    Please select your preferred payment method.
                </p>
             <FormProvider {...form}>
                    <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col md:flex-row gap-5">
                            <Controller
                                name="type"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="type">Payment Method</FieldLabel>
                                        <RadioGroup
                                            {...field}
                                            id="type"
                                            aria-invalid={fieldState.invalid}
                                            onValueChange={field.onChange}
                                            className='flex flex-col space-y-2'
                                            defaultValue={field.value}
                                        >
                                            {PAYMENT_METHODS.map((method) => (
                                                <Field orientation="horizontal" key={method} data-invalid={fieldState.invalid}>
                                                     <RadioGroupItem value={method} id={method}  />
                                                    <FieldContent>
                                                    <FieldLabel htmlFor={method}>{method}</FieldLabel>
                                                    </FieldContent>
                                                </Field>
                                            ))}
                                        </RadioGroup>
                                    </Field>
                                )}
                            />
                        </div>
                        <div className="flex gap-2">
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? (<Loader className="w-4 h-4 animate-spin" /> ): (<><ArrowRight /> <span>Save and Continue</span></>)}
                        </Button>
                        </div>
                    </form>
                </FormProvider>
                </div>
        </>
    );
}

export default PaymentMethodForm;