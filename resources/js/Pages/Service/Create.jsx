import AdminLayout from '@/Layouts/AdminLayout';
import ServiceForm from '@/Components/ServiceForm';
import { router } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function ServiceCreate() {
    const handleSubmit = (form) => {
        form.post(route('admin.services.store'), {
            onSuccess: () => {
                router.visit(route('admin.services.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6">
                    <PageHeader title="Create New Service" />
                    <div className="mt-8">
                        <ServiceForm onSubmit={handleSubmit} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 