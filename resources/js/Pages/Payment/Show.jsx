import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from '@/Components/PageHeader';

export default function PaymentShow({ payment }) {
    const getStatusBadgeVariant = (status) => {
        const variants = {
            pending: 'secondary',
            completed: 'success',
            cancelled: 'destructive'
        };
        return variants[status] || 'secondary';
    };

    const getEntityDetails = () => {
        if (payment.type === 'supplier') {
            return {
                type: 'Supplier',
                name: payment.supplier?.name,
                reference: payment.purchase?.invoice_number
            };
        }
        return {
            type: 'Customer',
            name: payment.customer?.name,
            reference: payment.invoice?.invoice_number
        };
    };

    const entity = getEntityDetails();

    return (
        <AdminLayout>
            <div className="p-6">
                <Card className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Payment Number:</span> {payment.payment_number}</p>
                                <p><span className="font-medium">Amount:</span> ${payment.amount}</p>
                                <p><span className="font-medium">Date:</span> {payment.payment_date}</p>
                                <p><span className="font-medium">Method:</span> {payment.payment_method?.replace('_', ' ').toUpperCase()}</p>
                                <p><span className="font-medium">Status:</span> 
                                    <Badge variant={getStatusBadgeVariant(payment.status)}>
                                        {payment.status?.toUpperCase()}
                                    </Badge>
                                </p>
                                <p><span className="font-medium">Account:</span> {payment.account?.name}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">{entity.type} Details</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {entity.name}</p>
                                <p><span className="font-medium">Reference Number:</span> {entity.reference}</p>
                                {payment.reference_number && (
                                    <p><span className="font-medium">Payment Reference:</span> {payment.reference_number}</p>
                                )}
                                {payment.notes && (
                                    <p><span className="font-medium">Notes:</span> {payment.notes}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
} 