<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'createProduct'])->name('products.create');
    Route::post('/products/create', [ProductController::class, 'saveCreateProduct'])->name('products.saveCreate');
    Route::put('/products/{product}', [ProductController::class, 'saveEditedProduct'])->name('products.saveEdited');
    Route::delete('/products/{product}', [ProductController::class, 'deleteProduct'])->name('products.deleteProd');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
