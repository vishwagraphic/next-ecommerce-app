'use client'
import { useRouter } from "next/navigation";
import {toast} from "sonner";
import { Controller, FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/lib/validators";
import z from "zod";
import slugify from "slugify";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { updateUser } from "@/lib/actions/user.actions";

 

const UserForm = ({user}: {user: z.infer<typeof updateUserSchema>}) => {

    const router = useRouter();
    

    const onSubmit: SubmitHandler<z.infer<typeof updateUserSchema>> = async (data: z.infer<typeof updateUserSchema>) => {
        try {
            const response = await updateUser({
                ...data,
                id: user.id,
            });
            if (response.success) {
                toast.success(response.message);
                router.refresh();
            } else {
                toast.error(response.message);
            }
            form.reset();
            router.push('/admin/users');
        } catch (error) {
            toast.error("An error occurred while updating the user");
        }
    };

    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: user,
    });

   
    return (
        <div className="flex flex-col gap-5 items-center w-full">
        <FormProvider {...form}>
            <form method="post" onSubmit={form.handleSubmit(onSubmit, () => {
                toast.error("Please fix the highlighted fields before submitting");
            })}>
                <div className="flex flex-col md:flex-row gap-5">
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    {...field}
                                    id="email"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter email"
                                    autoComplete="off"
                                />
                                {fieldState.error && <span>{fieldState.error.message}</span>}
                            </Field>
                        )}
                    />
                    </div>
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
                                    placeholder="Enter name"
                                    autoComplete="off"
                                />
                                {fieldState.error && <span>{fieldState.error.message}</span>}
                            </Field>
                        )}
                    />
                    </div>
                    <div className="flex flex-col md:flex-row gap-5">
                        <Controller
                            name="role"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="role">Role</FieldLabel>
                                    <Select
                                        name={field.name}
                                        value={field.value ?? null}
                                        onValueChange={(value) => field.onChange(value ?? undefined)}
                                    >
                                        <SelectTrigger
                                            id="role"
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            aria-invalid={fieldState.invalid}
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <span>{fieldState.error.message}</span>}
                                </Field>
                            )}
                        />
                    </div>
            
                <div className="flex-between">
                    <Button type="submit" size='lg' 
                    className="button col-span-2 w-full"
                    disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Submitting..." : "Update user"}
                    </Button>
                </div>
            </form>
        </FormProvider>
        </div>
    );
}
 
export default UserForm;