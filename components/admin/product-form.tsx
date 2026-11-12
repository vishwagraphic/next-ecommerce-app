'use client'
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import {toast} from "sonner";
import { Controller, FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import z from "zod";
import { productDefaultValues } from "@/lib/constants";
import slugify from "slugify";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

 
type ProductFormProps = {
    type: 'create' | 'update';
    product?: Product;
    productId?: string;
};

const productForm = ({type, product, productId}: ProductFormProps) => {

    const router = useRouter();
    const form = useForm<z.infer<typeof insertProductSchema>>({
        resolver: type === "update" ? zodResolver(updateProductSchema) : zodResolver(insertProductSchema) as any    ,
        defaultValues: type === "update" ? product : productDefaultValues as any
    });

    const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (data: z.infer<typeof insertProductSchema>) => {
        try {
            if (type === "update" && !productId) {
                toast.error("Product ID is required for update");
                return;
            }

            const response = type === "create"
                ? await createProduct(data)
                : await updateProduct(productId!, data);

            if (response.success) {
                toast.success(response.message);
                router.push("/admin/products");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Failed to submit product form:", error);
            toast.error(error instanceof Error ? error.message : "Failed to save product");
        }
    };

    const images = form.watch("images");
    const isFeatured = form.watch("isFeatured");
    const banner = form.watch("banner") as any;

    return (<FormProvider {...form}>
        <form method="post" onSubmit={form.handleSubmit(onSubmit, () => {
            toast.error("Please fix the highlighted fields before submitting");
        })}>
            <div className="flex flex-col md:flex-row gap-5">
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="name">Product Name</FieldLabel>
                            <Input
                                {...field}
                                id="name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter product name"
                                autoComplete="off"
                            />
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                        </Field>
                    )}
                />

                <Controller
                    name="slug"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="slug">Product Slug</FieldLabel>
                            <Input
                                {...field}
                                id="slug"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter product slug"
                                autoComplete="off"
                            />
                            <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2 w-25" 
                            onClick={() => {
                                form.setValue("slug", slugify(form.getValues("name").toLowerCase().replace(/\s+/g, "-"))); // Handle slug generation or other actions here
                            }}>
                                Generate Slug
                            </Button>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                        </Field>
                    )}
                />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                <Controller
                    name="category"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="category">Product Category</FieldLabel>
                            <Input
                                {...field}
                                id="category"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter product category"
                                autoComplete="off"
                            />
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                        </Field>
                    )}
                />

                 <Controller
                    name="brand"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="brand">Product Brand</FieldLabel>
                            <Input
                                {...field}
                                id="brand"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter product brand"
                                autoComplete="off"
                            />
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                        </Field>
                    )}
                />
                
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                 <Controller
                    name="price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="price">Product Price</FieldLabel>
                            <Input
                                {...field}
                                id="price"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter product price"
                                autoComplete="off"
                            />
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                        </Field>
                    )}
                />
                 <Controller
                    name="stock"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="stock">Product Stock</FieldLabel>
                            <Input
                                {...field}
                                id="stock"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter product stock"
                                autoComplete="off"
                            />
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                        </Field>
                    )}
                />
            </div>
            <div className="upload-field flex flex-col md:flex-row gap-5">
                 <Controller
                    name="images"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="images">Product Images</FieldLabel>
                            <Card>
                                <CardContent className="space-y-2 mt-2 min-h-48">
                                    <div className="flex flex-wrap gap-2">
                                        {images.map((image, index) => (
                                            <Image key={index} src={image} 
                                            alt={`Product ${index}`} 
                                            className="w-20 h-20 object-cover object-center rounded-sm"
                                            width={100}
                                            height={100}
                                            />
                                        ))}
                                    </div>
                                     <UploadButton
                                        endpoint="imageUploader"
                                        className="text-yellow-500"
                                        onClientUploadComplete={(res: { ufsUrl: string }[]) => {
                                            form.setValue("images", [...images, res[0].ufsUrl]);
                                        }}
                                        onUploadError={(error) => {
                                            toast.error(error.message);
                                        }}
                                        />
                            </CardContent>
                            </Card>
                            
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                        </Field>
                    )}
                />
                
            </div>
            <div className="upload-field">
                    Featured Product
                    <Card>
                        <CardContent className="space-y-2 mt-2">
                            <Controller
                            name="isFeatured"
                            render={({ field }) => (
                                <Checkbox
                                {...field}
                                name="isFeatured"
                                style={{ width: 20, height: 20 }}
                                checked={field.value ?? false}
                                onCheckedChange={(checked) => field.onChange(checked === true)}
                                />
                            )}
                            />
                            {isFeatured && banner && (
                                <Image src={banner} alt="Featured Product Banner" className="w-full object-cover object-center rounded-sm" width={500} height={100} />
                            )}
                            {isFeatured && !banner && (
                               
                                <UploadButton
                                    endpoint="imageUploader"
                                    className="text-yellow-500"
                                    onClientUploadComplete={(res: { ufsUrl: string }[]) => {
                                        form.setValue("banner", res[0].ufsUrl);
                                    }}
                                    onUploadError={(error) => {
                                        toast.error(error.message);
                                    }}
                                    />
                            )}
                        </CardContent>
                    </Card>
            </div>
            <div>
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="description">Product Description</FieldLabel>
                            <Textarea
                                {...field}
                                id="description"
                                aria-invalid={fieldState.invalid}
                                className="resize-none"
                                placeholder="Enter product description"
                                autoComplete="off"
                            />
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                        </Field>
                    )}
                />
            </div>
            <div>
                <Button type="submit" size='lg' 
                className="button col-span-2 w-full"
                disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting..." : `${type.charAt(0).toUpperCase() + type.slice(1)} Product`}
                </Button>
            </div>
        </form>
    </FormProvider>);
}
 
export default productForm;