import AdminLayout from '@/Layouts/AdminLayout';
import PaymentForm from '@/Components/PaymentForm';
import { router } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function PaymentCreate({ customers, invoices, accounts }) {
    const handleSubmit = (form) => {
        form.post(route('admin.payments.store'), {
            onSuccess: () => {
                router.visit(route('admin.payments.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Record New Payment" />
                    
                    <div className="bg-white rounded-lg border p-6">
                        <PaymentForm
                            customers={customers}
                            invoices={invoices}
                            accounts={accounts}
                            onSubmit={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 