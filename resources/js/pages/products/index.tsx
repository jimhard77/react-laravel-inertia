import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { create, deleteProd } from '@/routes/products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator";
import ProductCard from "./product-card";
import { useEffect } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Product {
    id: number;
    product_name: string;
    product_description: string;
    product_price: number;
}

interface ProductProps {
    flash: {
        message?: string
    },
    products: Product[]
}


export default function ProductPage({ products }: ProductProps) {
    const { flash } = usePage().props as any;
    const { processing, errors, delete: destroy } = useForm()

    useEffect(() => {
        flash.message && toast.success(flash.message);
    }, [flash])

    const handleDeleteButton = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
        // e.preventDefault();
        destroy(deleteProd(id).url, {
            onSuccess(response: any) {
                toast.success("Product deleted successfully")
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your product inventory
                        </p>
                    </div>
                    <Link href={create()}>
                        <Button className="w-full sm:w-auto">
                            Add Product
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 sm:gap-6">
                    {/* Product grid will go here */}
                    {products.length === 0 &&
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No products yet. Add your first product to get started.</p>
                        </div>
                    }
                    <div className="grid grid-cols-4 gap-4">
                        {products.map((product) => (
                            <Card key={product.id}>
                                <CardHeader>
                                    <CardTitle>{product.product_name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {
                                        product.product_description === null ? <CardDescription>No description provided.</CardDescription> : <CardDescription>{product.product_description}</CardDescription>
                                    }

                                    {product.product_price}
                                    <div className="w-full flex justify-end">
                                        <Dialog>
                                            <DialogTrigger className="border-1 bg-primary rounded-sm text-white p-2 text-sm">Edit</DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Product</DialogTitle>
                                                    <DialogDescription>
                                                        Fill in the form below to edit your product.
                                                    </DialogDescription>
                                                    <Separator />
                                                </DialogHeader>
                                                <ProductCard
                                                    title="Edit Product" method="edit" description="Fill in the form below to edit your product."
                                                    product={product}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger disabled={processing} className="border-1 bg-red-500 hover:bg-red-700 transition-colors duration-150 rounded-sm text-white p-2 text-sm">Delete</AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete {product.product_name}.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-500 hover:bg-red-700 transition-colors duration-150" onClick={(e) => handleDeleteButton(product.id, e)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
