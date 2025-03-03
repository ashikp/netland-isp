import AdminLayout from '@/Layouts/AdminLayout';
import SupplierForm from './Form';

export default function Create() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <h1 className="text-2xl font-bold">Create Supplier</h1>
                </div>

                <div className="px-4">
                    <SupplierForm mode="create" />
                </div>
            </div>
        </AdminLayout>
    );
} 