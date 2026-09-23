<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| API Documentation (Swagger UI)
|--------------------------------------------------------------------------
*/
Route::get('/docs', function () {
    return view('docs');
})->name('docs');

Route::get('/docs/openapi.json', function () {
    $path = base_path('docs/openapi.json');
    return response()->file($path, ['Content-Type' => 'application/json']);
})->name('docs.json');

Route::get('/docs/openapi.yaml', function () {
    $path = base_path('docs/openapi.yaml');
    return response()->file($path, ['Content-Type' => 'application/x-yaml']);
})->name('docs.yaml');
