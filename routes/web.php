<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\NasController;
use App\Http\Controllers\RealIpController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\CustomerDashboardController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\PurchaseController;
use App\Http\Controllers\Admin\PurchasePaymentController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Include the auth routes
// require __DIR__ . '/auth.php';

// Default route redirects to customer login
Route::get('/', function () {
    return redirect()->route('customer.login');
});

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Guest routes for admin
    Route::middleware('guest:web')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'login'])->name('login.submit');
    });

    // Protected admin routes
    Route::middleware('auth:web')->group(function () {
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

        // Reports
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/monthly-sales', [ReportController::class, 'monthlySales'])->name('reports.monthly-sales');
        Route::get('/reports/monthly-stock', [ReportController::class, 'monthlyStock'])->name('reports.monthly-stock');
        Route::get('/reports/monthly-income', [ReportController::class, 'monthlyIncome'])->name('reports.monthly-income');
        Route::get('/reports/monthly-expense', [ReportController::class, 'monthlyExpense'])->name('reports.monthly-expense');
        Route::get('/reports/monthly-payment', [ReportController::class, 'monthlyPayment'])->name('reports.monthly-payment');
        Route::get('/reports/monthly-accounts-balance', [ReportController::class, 'monthlyAccountsBalance'])->name('reports.monthly-accounts-balance');
        
        // Profile Management
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // ISP Management
        Route::resource('customers', CustomerController::class);
        Route::resource('nas', NasController::class);
        Route::resource('packages', PackageController::class);
        Route::resource('real-ips', RealIpController::class);
        Route::resource('services', ServiceController::class);

        // Accounting System
        Route::resource('accounts', AccountController::class);
        Route::resource('invoices', InvoiceController::class);
        Route::resource('payments', PaymentController::class);
        Route::resource('expenses', ExpenseController::class);
        Route::resource('transfers', TransferController::class);
        
        // NAS
        Route::put('/nas/{nas}', [NasController::class, 'update'])->name('admin.nas.update');
        Route::delete('/nas/{id}', [NasController::class, 'destroy'])->name('admin.nas.destroy');
        
        // Services
        Route::put('/services/{service}', [ServiceController::class, 'update'])->name('admin.services.update');
        Route::delete('/services/{id}', [ServiceController::class, 'destroy'])->name('admin.services.destroy');

        // Additional invoice routes
        Route::post('/invoices/{invoice}/send', [InvoiceController::class, 'send'])->name('invoices.send');
        Route::post('/invoices/{invoice}/mark-as-paid', [InvoiceController::class, 'markAsPaid'])->name('invoices.mark-as-paid');
        Route::post('/invoices/{invoice}/cancel', [InvoiceController::class, 'cancel'])->name('invoices.cancel');

        // Additional payment routes
        Route::post('payments/{payment}/process', [PaymentController::class, 'process'])->name('payments.process');
        Route::post('payments/{payment}/cancel', [PaymentController::class, 'cancel'])->name('payments.cancel');
        Route::post('/invoices/{invoice}/payments', [PaymentController::class, 'storeInvoicePayment'])->name('payments.store-invoice-payment');

        // Additional expense routes
        Route::post('expenses/{expense}/approve', [ExpenseController::class, 'approve'])->name('expenses.approve');
        Route::post('expenses/{expense}/reject', [ExpenseController::class, 'reject'])->name('expenses.reject');

        // Additional transfer routes
        Route::post('transfers/{transfer}/process', [TransferController::class, 'process'])->name('transfers.process');
        Route::post('transfers/{transfer}/cancel', [TransferController::class, 'cancel'])->name('transfers.cancel');

        // Asset Management Routes
        Route::resource('products', ProductController::class);
        Route::resource('inventory', InventoryController::class);
        Route::resource('purchases', PurchaseController::class);
        Route::get('/purchases/{purchase}/invoice', [PurchaseController::class, 'invoice'])->name('purchases.invoice');
        Route::post('/purchases/{purchase}/payments', [PurchasePaymentController::class, 'store'])
            ->name('purchases.payments.store');
        });

        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
});

// Customer Routes
Route::prefix('customer')->name('customer.')->group(function () {
    // Guest routes for customer
    Route::middleware('guest:customer')->group(function () {
        Route::get('/login', [CustomerAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [CustomerAuthController::class, 'login'])->name('login.submit');
    });

    // Protected customer routes
    Route::middleware('auth:customer')->group(function () {
        Route::get('/dashboard', [CustomerDashboardController::class, 'dashboard'])->name('dashboard');
        Route::get('/invoices', [CustomerDashboardController::class, 'invoices'])->name('invoices');
        Route::get('/payments', [CustomerDashboardController::class, 'payments'])->name('payments');
        Route::get('/ledger', [CustomerDashboardController::class, 'ledger'])->name('ledger');
        Route::post('/logout', [CustomerAuthController::class, 'logout'])->name('logout');
    });
});

// Supplier Routes
Route::prefix('admin')->name('admin.')->middleware(['auth'])->group(function () {
    Route::resource('suppliers', SupplierController::class);
    Route::post('suppliers/{supplier}/update-balance', [SupplierController::class, 'updateBalance'])
        ->name('suppliers.update-balance');
});