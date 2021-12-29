<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/dashboard');
});

Route::group(['middleware' => ['auth'], 'prefix' => 'dashboard'], function () {

    Route::get('/', function () {
        return view('home');
    })->name('home');

    // Company crud
    Route::resource('/company', 'Company\CompanyController');
    Route::get('/companieslist', 'Company\CompanyController@companiesList');
    
    // Employee crud
    Route::resource('/employee', 'Employee\EmployeeController');
    Route::get('/employeeslist', 'Employee\EmployeeController@employeesList');
});


require __DIR__.'/auth.php';
