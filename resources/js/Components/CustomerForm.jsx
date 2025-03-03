import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { format } from 'date-fns';

export default function CustomerForm({ 
    customer = null, 
    packages, 
    realIps, 
    nas, 
    onSubmit 
}) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        first_name: customer?.first_name || '',
        last_name: customer?.last_name || '',
        email: customer?.email || '',
        username: customer?.username || '',
        pppoe_password: customer?.pppoe_password || '',
        phone_number: customer?.phone_number || '',
        address: customer?.address || '',
        city: customer?.city || '',
        state: customer?.state || '',
        country: customer?.country || '',
        nid_number: customer?.nid_number || '',
        date_of_birth: customer?.date_of_birth || '',
        package_id: customer?.package_id?.toString() || '',
        real_ip_id: customer?.real_ip_id?.toString() || '',
        expire_date: customer?.expire_date || '',
        payment_module: customer?.payment_module || 'cash',
        nas_id: customer?.nas_id?.toString() || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const calculateTotalCost = () => {
        let total = 0;

        // Add package cost
        if (form.data.package_id) {
            const selectedPkg = packages.find(pkg => pkg.id.toString() === form.data.package_id);
            if (selectedPkg) {
                total += parseFloat(selectedPkg.package_cost);
            }
        }

        // Add Real IP cost if selected
        if (form.data.real_ip_id) {
            const selectedIp = realIps.find(ip => ip.id.toString() === form.data.real_ip_id);
            if (selectedIp) {
                total += parseFloat(selectedIp.customer_cost);
            }
        }

        return total.toFixed(2);
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
                {/* Personal Information - First Column */}
                <div className="space-y-4">
                    {/* Basic Information Card */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">Basic Information</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={form.data.first_name}
                                    onChange={e => form.setData('first_name', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={form.data.last_name}
                                    onChange={e => form.setData('last_name', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    value={form.data.phone_number}
                                    onChange={e => form.setData('phone_number', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={form.data.date_of_birth}
                                    onChange={e => form.setData('date_of_birth', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="nid_number">NID Number</Label>
                                <Input
                                    id="nid_number"
                                    value={form.data.nid_number}
                                    onChange={e => form.setData('nid_number', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information Card */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">Address Information</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={form.data.address}
                                    onChange={e => form.setData('address', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={form.data.city}
                                    onChange={e => form.setData('city', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    value={form.data.state}
                                    onChange={e => form.setData('state', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={form.data.country}
                                    onChange={e => form.setData('country', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Package Information - Second Column */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold">Package Information</h3>
                    </div>
                    <div className="p-4 space-y-4">
                        {/* Package Information Fields */}
                        <div>
                            <Label htmlFor="package_id">Package</Label>
                            <Select
                                value={form.data.package_id}
                                onValueChange={value => form.setData('package_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a package" />
                                </SelectTrigger>
                                <SelectContent>
                                    {packages.map(pkg => (
                                        <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                            {pkg.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="real_ip_id">Real IP (Optional)</Label>
                            <Select
                                value={form.data.real_ip_id || ""}
                                onValueChange={value => {
                                    form.setData('real_ip_id', value === "none" ? null : value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an IP address (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No IP Address</SelectItem>
                                    {realIps.map(ip => (
                                        <SelectItem key={ip.id} value={ip.id.toString()}>
                                            {ip.ip_address} - ${ip.customer_cost}/month
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground mt-1">
                                Additional charges will apply for Real IP assignment
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="nas_id">NAS</Label>
                            <Select
                                value={form.data.nas_id}
                                onValueChange={value => form.setData('nas_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select NAS" />
                                </SelectTrigger>
                                <SelectContent>
                                    {nas.map(n => (
                                        <SelectItem key={n.id} value={n.id.toString()}>
                                            {n.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="expire_date">Expire Date</Label>
                            <Input
                                id="expire_date"
                                type="date"
                                value={form.data.expire_date}
                                onChange={e => form.setData('expire_date', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="payment_module">Payment Module</Label>
                            <Select
                                value={form.data.payment_module}
                                onValueChange={value => form.setData('payment_module', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Login Information - Third Column */}
                <div className="flex flex-col space-y-4">
                    {/* Login Credentials Card */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">Login Credentials</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={form.data.username}
                                    onChange={e => form.setData('username', e.target.value)}
                                    placeholder="PPPoE/Hotspot Username"
                                />
                            </div>
                            <div>
                                <Label htmlFor="pppoe_password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="pppoe_password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.data.pppoe_password}
                                        onChange={e => form.setData('pppoe_password', e.target.value)}
                                        placeholder="PPPoE/Hotspot Password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white rounded-lg shadow flex-1">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">Summary</h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                {/* PPPoE Username */}
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm font-medium">PPPoE Username:</span>
                                    <span className="text-sm">{form.data.username || 'Not set'}</span>
                                </div>

                                {/* Expire Time */}
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm font-medium">Expire Time:</span>
                                    <span className="text-sm">
                                        {form.data.expire_date ? format(new Date(form.data.expire_date), 'MMM dd, yyyy') : 'Not set'}
                                    </span>
                                </div>

                                {/* Package Details */}
                                <div className="py-2 border-b">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Package:</span>
                                        <span className="text-sm">
                                            {packages.find(p => p.id.toString() === form.data.package_id)?.name || 'Not selected'}
                                        </span>
                                    </div>
                                    {form.data.package_id && (
                                        <div className="mt-1">
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>Cost:</span>
                                                <span>
                                                    ${packages.find(p => p.id.toString() === form.data.package_id)?.package_cost || '0.00'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-gray-600">
                                                <span>Subscription:</span>
                                                <span className="capitalize">
                                                    {packages.find(p => p.id.toString() === form.data.package_id)?.subscription_type || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Real IP Details */}
                                <div className="py-2 border-b">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Real IP:</span>
                                        <span className="text-sm">
                                            {realIps.find(ip => ip.id.toString() === form.data.real_ip_id)?.ip_address || 'None'}
                                        </span>
                                    </div>
                                    {form.data.real_ip_id && (
                                        <div className="mt-1 flex justify-between items-center text-sm text-gray-600">
                                            <span>Cost:</span>
                                            <span>
                                                ${realIps.find(ip => ip.id.toString() === form.data.real_ip_id)?.customer_cost || '0.00'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm font-medium">Payment Method:</span>
                                    <span className="text-sm capitalize">{form.data.payment_module || 'Not selected'}</span>
                                </div>

                                {/* Total Cost */}
                                <div className="pt-4 mt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold">Total Cost:</span>
                                        <span className="text-base font-semibold">
                                            ${calculateTotalCost()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <Button 
                            type="submit" 
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={form.processing}
                        >
                            Create/Update Customer
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 