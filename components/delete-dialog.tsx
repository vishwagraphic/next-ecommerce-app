'use client';
import { Button } from "@/components/ui/button";
import {useState, useTransition} from "react";
import {toast} from 'sonner'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "./ui/alert-dialog";
    
const DeleteDialog = ({id, onDelete} : 
    {id: string, onDelete: (id: string) => Promise<{success: boolean, message?: string}> }) => {
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    console.log("DeleteDialog rendered with id:", id);
    const handleDelete = () => {
        startTransition(async () => {
            const result = await onDelete(id);
            if (result.success) {
                toast.success(result.message || "Item deleted successfully");
                setOpen(false);
            } else {
                toast.error(result.message || "Failed to delete item");
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                render={<Button size="sm" variant='destructive' className="ml-2" />}
            >
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    This action cannot be undone.
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>
                    <Button onClick={handleDelete}>{isPending ? "Deleting..." : "Confirm Delete"}</Button>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;