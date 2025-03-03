import AdminLayout from '@/Layouts/AdminLayout';
import CustomerForm from '@/Components/CustomerForm';
import PageHeader from '@/Components/PageHeader';
import { router } from '@inertiajs/react';

export default function CustomerEdit({ customer, packages, realIps, nas }) {
    const handleSubmit = (form) => {
        form.put(route('admin.customers.update', customer.id), {
            onSuccess: () => {
                router.visit(route('admin.customers.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Update Customer" />
                    
                    <CustomerForm
                        customer={customer}
                        packages={packages}
                        realIps={realIps}
                        nas={nas}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </AdminLayout>
    );
} 