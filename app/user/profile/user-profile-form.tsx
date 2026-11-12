'use client'

import {useSession} from "next-auth/react";
import {Controller, FormProvider, useForm, SubmitHandler} from 'react-hook-form'
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateProfileSchema} from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useTransition } from "react";
import {Loader, ArrowRight} from "lucide-react";
import {toast} from "sonner";
import { updateProfile } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

const UserProfileForm = () => {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isPending] = useTransition()


   const form = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: session?.user?.name || '',
            email: session?.user?.email || '',
        },
    });

    const submitHandler: SubmitHandler<z.infer<typeof updateProfileSchema>> = async (data: z.infer<typeof updateProfileSchema>) => {
        try {
            const response = await updateProfile(data.name, data.email);
            if (!response.success) {
                toast.error(<div className="bg-red-100 text-red-800 p-4 rounded-md">
                    {response.message}
                </div>)
                return;
            }
            const newSession = {
                ...session,
                user: {
                    ...session?.user,
                    name: data.name,
                },
            };
            await update(newSession);         
            router.refresh();
            
            toast.success('Profile updated successfully');
            
        } catch (error) {
            console.error('Error updating profile:', error);
            return;
        }

        
    };

    return ( <>
        <FormProvider {...form}>
            <form method="post" className="space-y-4" onSubmit={form.handleSubmit(submitHandler)}>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col md:flex-row gap-5">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id="name"
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
                                name="email"
                                control={form.control}
                                disabled={true}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="shadcn"
                                            autoComplete="username"
                                        />
                                    </Field>
                                )}
                            />
                    </div>
                </div>
                <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? (<Loader className="w-4 h-4 animate-spin" /> ): (<><ArrowRight /> <span>Update Profile</span></>)}
                </Button>
                </div>
            </form>
        </FormProvider>
    </> );
}
 
export default UserProfileForm;