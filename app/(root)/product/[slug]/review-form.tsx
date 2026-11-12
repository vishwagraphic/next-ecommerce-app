'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createUpdateReview, getReviewByProductId } from "@/lib/actions/review.actions";
import { reviewDefaultValues } from "@/lib/constants";
import { insertReviewSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, Form, FormProvider, useForm } from "react-hook-form";
import {toast} from 'sonner'
import z from "zod";

const reviewFormSchema = insertReviewSchema

const ReviewForm = ({productId, userId, onReviewSubmitted}: 
    {productId: string, userId: string, onReviewSubmitted: () => void}) => {

        const [open, setOpen] = useState(false);

        const form = useForm<z.infer<typeof reviewFormSchema>>({
            resolver: zodResolver(reviewFormSchema) as any,
            defaultValues: reviewDefaultValues
        });

        const handleSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
            try {
                const response = await createUpdateReview({ ...values, productId } as any);
                if (!response.success) {
                    toast.error(response.message ?? 'Failed to submit review.');
                    return;
                }

                onReviewSubmitted();
                form.reset();
                setOpen(false);
                toast.success('Review submitted.');
            } catch {
                toast.error('Unable to submit review.');
            }
        };

    const handleOpenForm = async () => {
        form.setValue('productId', productId);
        form.setValue('userId', userId);
        const review = await getReviewByProductId(productId);
        if (review?.data) {
            form.setValue('title', review?.data?.title as string);
            form.setValue('description', review?.data?.description as string);
            form.setValue('rating', review?.data?.rating as number);
        }

        setOpen(true); 
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button onClick={handleOpenForm}>Write a review</Button>
            <DialogContent className="sm:max-w-106.25">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} method="post" className="flex flex-col gap-3">
                        <DialogHeader>
                            <DialogTitle>Write a Review</DialogTitle>
                            <DialogDescription>Please provide your feedback below.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="Write your review title here"
                                        required
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Write your review description here"
                                        required
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Controller
                                name="rating"
                                control={form.control}
                                render={({ field }) => (
                                    <Select {...field} onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                                    {i + 1} <StarIcon className="inline-block" />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                       
                                    </Select>
                                )}
                            />
                        </div>
                        
                          <DialogFooter>
                    <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </DialogFooter>
                    </form>
                </FormProvider>
              
            </DialogContent>
        </Dialog>
    );
}
 
export default ReviewForm;