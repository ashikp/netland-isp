import { Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';

export default function Dashboard({ customer, currentPackage, recentInvoices, recentPayments }) {
    return (
        <CustomerLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Welcome, {customer.full_name}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Account Summary */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Account Summary</h2>
                        <dl className="space-y-2">
                            <div className="flex justify-between">
                                <dt className="text-gray-600">Balance</dt>
                                <dd className="font-medium">${customer.balance}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-600">Status</dt>
                                <dd className="font-medium">{customer.status}</dd>
                            </div>
                        </dl>
                    </Card>

                    {/* Current Package */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Current Package</h2>
                        {currentPackage ? (
                            <dl className="space-y-2">
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Name</dt>
                                    <dd className="font-medium">{currentPackage.name}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Speed</dt>
                                    <dd className="font-medium">
                                        {currentPackage.download_speed}Mbps/{currentPackage.upload_speed}Mbps
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Type</dt>
                                    <dd className="font-medium">
                                        {currentPackage.subscription_type.name}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Price</dt>
                                    <dd className="font-medium">
                                        ${currentPackage.price}
                                    </dd>
                                </div>
                            </dl>
                        ) : (
                            <p className="text-gray-500">No package assigned</p>
                        )}
                    </Card>
                </div>

                {/* Recent Invoices */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Recent Invoices</h2>
                        <Link
                            href={route('customer.invoices')}
                            className="text-sm text-primary hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <Card>
                        <div className="divide-y">
                            {recentInvoices.map(invoice => (
                                <div key={invoice.id} className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{invoice.invoice_number}</p>
                                            <p className="text-sm text-gray-500">
                                                {format(new Date(invoice.issue_date), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">${invoice.total}</p>
                                            <p className="text-sm text-gray-500">
                                                {invoice.status.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Recent Payments */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Recent Payments</h2>
                        <Link
                            href={route('customer.payments')}
                            className="text-sm text-primary hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <Card>
                        <div className="divide-y">
                            {recentPayments.map(payment => (
                                <div key={payment.id} className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{payment.payment_number}</p>
                                            <p className="text-sm text-gray-500">
                                                {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-green-600">
                                                +${payment.amount}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {payment.payment_method.replace('_', ' ').toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </CustomerLayout>
    );
} 