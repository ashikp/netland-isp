import AdminLayout from '@/Layouts/AdminLayout';
import ServiceForm from '@/Components/ServiceForm';
import { router } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function ServiceEdit({ service }) {
    const handleSubmit = (form) => {
        form.put(route('admin.services.update', service.id), {
            onSuccess: () => {
                router.visit(route('admin.services.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                <PageHeader title="Edit Service" />
                
                <div className="rounded-md border bg-white p-6">
                    <ServiceForm 
                        onSubmit={handleSubmit}
                        initialData={service}
                        isEditing={true}
                    />
                </div>
            </div>
        </AdminLayout>
    );
} 