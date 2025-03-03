<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Package;
use App\Models\RealIp;
use App\Models\Nas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $customers = Customer::latest()
            ->with('package')
            ->paginate(10)
            ->through(fn ($customer) => $customer->makeVisible('pppoe_password'));

        return Inertia::render('Customer/Index', [
            'customers' => $customers
        ]);
    }

    public function create()
    {
        return Inertia::render('Customer/Create', [
            'packages' => Package::select('id', 'name', 'package_cost', 'subscription_type')->get(),
            'realIps' => RealIp::select('id', 'ip_address', 'customer_cost')->where('is_used', false)->get(),
            'nas' => Nas::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:customers',
            'pppoe_password' => 'required|string|min:6',
            'email' => 'required|email|unique:customers',
            'phone_number' => 'required|string',
            'address' => 'required|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'country' => 'nullable|string',
            'nid_number' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'package_id' => 'nullable|exists:packages,id',
            'real_ip_id' => 'nullable|exists:real_ips,id',
            'expire_date' => 'required|date',
            'payment_module' => 'required|in:cash,bank_transfer,mobile_banking',
            'nas_id' => 'nullable|exists:nas,id',
        ]);

        Customer::create($validated);

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer created successfully');
    }

    public function edit(Customer $customer)
    {
        $customer->load(['package', 'realIp', 'nas'])->makeVisible('pppoe_password');

        return Inertia::render('Customer/Edit', [
            'customer' => $customer,
            'packages' => Package::select('id', 'name', 'package_cost', 'subscription_type')->get(),
            'realIps' => RealIp::select('id', 'ip_address', 'customer_cost')->where('is_used', false)->orWhere('id', $customer->real_ip_id)->get(),
            'nas' => Nas::select('id', 'name')->get()
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|unique:customers,username,'.$customer->id,
            'pppoe_password' => 'required|string|min:6',
            'email' => 'required|email|unique:customers,email,'.$customer->id,
            'phone_number' => 'required|string',
            'address' => 'required|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'country' => 'nullable|string',
            'nid_number' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
            'package_id' => 'nullable|exists:packages,id',
            'real_ip_id' => 'nullable|exists:real_ips,id',
            'expire_date' => 'required|date',
            'payment_module' => 'required|in:cash,bank_transfer,mobile_banking',
            'nas_id' => 'nullable|exists:nas,id',
        ]);

        $customer->update($validated);

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer updated successfully');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer deleted successfully');
    }
} 