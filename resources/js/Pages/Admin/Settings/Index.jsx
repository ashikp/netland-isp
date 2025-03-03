import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Settings({ settings }) {
    const { data, setData, post, processing, errors } = useForm(settings);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    return (
        <AdminLayout>
            <Head title="Site Settings" />

            <div className="max-w-4xl mx-auto py-6">
                <Card>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <h2 className="text-2xl font-semibold">Site Settings</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Website Name</label>
                                <Input
                                    value={data.website_name}
                                    onChange={e => setData('website_name', e.target.value)}
                                    error={errors.website_name}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Currency</label>
                                <Input
                                    value={data.currency}
                                    onChange={e => setData('currency', e.target.value)}
                                    error={errors.currency}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Company Name</label>
                                <Input
                                    value={data.company_name}
                                    onChange={e => setData('company_name', e.target.value)}
                                    error={errors.company_name}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Company Email</label>
                                <Input
                                    type="email"
                                    value={data.company_email}
                                    onChange={e => setData('company_email', e.target.value)}
                                    error={errors.company_email}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Company Phone</label>
                                <Input
                                    value={data.company_phone}
                                    onChange={e => setData('company_phone', e.target.value)}
                                    error={errors.company_phone}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Company Address</label>
                                <textarea
                                    className="w-full rounded-md border-gray-300"
                                    rows="3"
                                    value={data.company_address}
                                    onChange={e => setData('company_address', e.target.value)}
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={processing}>
                            Save Settings
                        </Button>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
} 