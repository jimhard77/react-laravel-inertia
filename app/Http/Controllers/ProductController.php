<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    public function createProduct()
    {
        return Inertia::render('products/createPage', []);
    }

    public function saveCreateProduct(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:100',
            'product_description' => 'nullable|string',
            'product_price' => 'required|numeric'
        ]);
        $validated['product_name'] = strtoupper($validated['product_name']);
        Product::create($validated);
        // return redirect()->back();
        return redirect()->route('products.index')->with('message', 'Product Created Successfully');
    }

    public function saveEditedProduct(Product $product, Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:100',
            'product_description' => 'nullable|string',
            'product_price' => 'required|numeric'
        ]);

        $validated['product_name'] = strtoupper($validated['product_name']);
        $product->update($validated);
        // return redirect()->route('products.index')->with('message', 'Product Edited Successfully');
    }

    public function deleteProduct(Product $product)
    {
        $product->delete();
        // return redirect()->route('products.index')->with('message', 'Product Deleted Successfully');
    }
}
