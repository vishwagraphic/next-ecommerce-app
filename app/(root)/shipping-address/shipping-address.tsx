'use client'
import {ShippingAddress } from '@/types'
import {useRouter} from 'next/navigation'
import {useTransition} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {Controller, FormProvider, useForm, SubmitHandler} from 'react-hook-form'
import z from 'zod'
import { shippingAddressSchema } from 
'@/lib/validators'
import { shippingAddressDefaultValues } from '@/lib/constants'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader } from 'lucide-react'
import {updateUserAddress} from '@/lib/actions/user.actions'
import { toast } from 'sonner'


const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues
    })

    const [isPending, startTransition] = useTransition()

    const onSubmit:SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (data: z.infer<typeof shippingAddressSchema>) => {
        startTransition(async () => {
            const res = await updateUserAddress(data)

            if (!res.success) {
                 toast.error(<div className="bg-red-100 text-red-800 p-4 rounded-md">
                    {res.message}
                </div>)
                return
            }
            if (res.success) {
                toast.success('Shipping address updated successfully.')
            }

            router.push('/payment-method')


        })
    }
    return ( 
        <>
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="h2-bold mt-4">Shipping Address</h1>
                <p className="text-sm text-muted-foreground">
                    Please enter your shipping address details.
                </p>
                <FormProvider {...form}>
                    <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col md:flex-row gap-5">
                            <Controller
                                name="fullName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id="fullName"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="shadcn"
                                            autoComplete="username"
                                        />
                                        {fieldState.error && <span>{fieldState.error.message}</span>}
                                    </Field>
                                )}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <Controller
                                name="streetAddress"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="streetAddress">Street Address</FieldLabel>
                                        <Input
                                            {...field}
                                            id="streetAddress"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="123 Main Street"
                                        />
                                        {fieldState.error && <span>{fieldState.error.message}</span>}
                                    </Field>
                                )}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <Controller
                                name="city"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="city">City</FieldLabel>
                                        <Input
                                            {...field}
                                            id="city"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="New York"
                                        />
                                        {fieldState.error && <span>{fieldState.error.message}</span>}
                                    </Field>
                                )}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                            <Controller
                                name="country"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="country">Country</FieldLabel>
                                        <Input
                                            {...field}
                                            id="country"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="United States"
                                        />
                                        {fieldState.error && <span>{fieldState.error.message}</span>}
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
 
export default ShippingAddressForm;