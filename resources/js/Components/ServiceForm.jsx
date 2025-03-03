import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function ServiceForm({ onSubmit, initialData = {}, isEditing = false }) {
    const form = useForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        status: initialData.status || 'active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-base font-semibold text-gray-900">
                                Service Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Enter service name"
                                className="h-11 text-base"
                                value={form.data.name}
                                onChange={e => form.setData('name', e.target.value)}
                            />
                            {form.errors.name && (
                                <p className="text-sm text-red-500">{form.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-base font-semibold text-gray-900">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Enter service description"
                                className="min-h-[120px] text-base resize-none"
                                value={form.data.description}
                                onChange={e => form.setData('description', e.target.value)}
                            />
                            {form.errors.description && (
                                <p className="text-sm text-red-500">{form.errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-base font-semibold text-gray-900">
                                    Price
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                        $
                                    </span>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="h-11 text-base pl-7"
                                        value={form.data.price}
                                        onChange={e => form.setData('price', e.target.value)}
                                    />
                                </div>
                                {form.errors.price && (
                                    <p className="text-sm text-red-500">{form.errors.price}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-base font-semibold text-gray-900">
                                    Status
                                </Label>
                                <Select
                                    value={form.data.status}
                                    onValueChange={(value) => form.setData('status', value)}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active" className="text-green-600">
                                            ● Active
                                        </SelectItem>
                                        <SelectItem value="inactive" className="text-gray-500">
                                            ○ Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.status && (
                                    <p className="text-sm text-red-500">{form.errors.status}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="w-32 h-11 text-base font-semibold bg-primary hover:bg-primary/90"
                        >
                            {form.processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing
                                </span>
                            ) : isEditing ? 'Update Service' : 'Create Service'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 