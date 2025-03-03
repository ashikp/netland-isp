import AdminLayout from '@/Layouts/AdminLayout';
import CustomerForm from '@/Components/CustomerForm';
import { router } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function CustomerCreate({ packages, realIps, nas }) {
    const handleSubmit = (form) => {
        form.post(route('admin.customers.store'), {
            onSuccess: () => {
                router.visit(route('admin.customers.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Create Customer" />
                    
                    <CustomerForm
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