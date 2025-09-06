import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { saveCreate, saveEdited, } from '@/routes/products';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

interface Product {
    id: number;
    product_name: string;
    product_description: string;
    product_price: number;
}

interface ProductProps {
    title: string;
    description: string;
    method: string;
    product?: Product;
}

export default function ProductCard({ title, description, method, product }: ProductProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        product_name: method === 'add' ? '' : product?.product_name,
        product_description: method === 'add' ? '' : product?.product_description,
        product_price: method === 'add' ? '1' : product?.product_price,
    })

    const handleOnInputUnitPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value
            .replace(/[^0-9.]/g, "")     // only digits + dot
            .replace(/(\..*)\./g, "$1"); // allow only one dot

        // Convert to number for clamping
        let num = parseFloat(value);

        if (!isNaN(num)) {
            if (num < 1) num = 1;
            if (num > 1000) num = 1000;
            value = num.toString();
        }

        e.currentTarget.value = value;
    }

    const handleAddProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(saveCreate().url, {
            onSuccess(response: any) {
                toast.success("Product added successfully")
            }
        });
    }

    const handleEditProductSubmit = (id: number, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(saveEdited(id).url, {
            onSuccess(response: any) {
                toast.success("Product Edit successfully")
            },
            onError(response: any) {
                toast.error("Something went wrong. Please try again.")
            }
        });
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-sm sm:text-base">{description}</CardDescription>
                <Separator className="my-4" />
                <form onSubmit={(e) => method === 'add' ? handleAddProductSubmit(e) : handleEditProductSubmit(product!.id, e)} className='flex flex-col gap-4 mt-6'>
                    {/* <input type="hidden" name="_method" value={method} /> */}

                    <div className="space-y-2">
                        <Label htmlFor='product-name' className="text-sm font-medium">Product Name</Label>
                        <Input
                            id='product-name'
                            className='uppercase w-full'
                            placeholder="Enter product name"
                            onChange={(e) => setData('product_name', e.target.value)}
                            defaultValue={method === 'add' ? data.product_name : product?.product_name}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor='product-description' className="text-sm font-medium">Product Description</Label>
                        <Textarea
                            id='product-description'
                            className="min-h-[100px] w-full border-1 p-2 rounded-sm"
                            placeholder="Enter product description"
                            onChange={(e) => setData('product_description', e.target.value)}
                            defaultValue={method === 'add' ? data.product_description : product?.product_description}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor='product-price' className="text-sm font-medium">Product Unit Price</Label>
                        <Input
                            id="product-price"
                            type="text"
                            inputMode="decimal"
                            onInput={handleOnInputUnitPrice}
                            className="w-full"
                            placeholder="1.00"
                            onChange={(e) => setData('product_price', e.target.value)}
                            defaultValue={method === 'add' ? data.product_price : product?.product_price}
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-4">
                        <Button type='submit' className="w-full sm:w-auto" disabled={processing}>
                            {processing && <LoaderCircle className='animate-spin transition-normal duration-500' />} Save Product
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
