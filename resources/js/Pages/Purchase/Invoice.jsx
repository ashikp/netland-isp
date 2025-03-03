import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';

export default function Invoice({ purchase }) {
    const formatNumber = (value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '0.00' : number.toFixed(2);
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <Card className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-center mb-2">PURCHASE INVOICE</h1>
                        <p className="text-center text-gray-500">#{purchase.invoice_number}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="font-semibold mb-2">Supplier Details</h3>
                            <p className="text-gray-700">{purchase.supplier.name}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-semibold mb-2">Purchase Info</h3>
                            <p className="text-gray-700">Date: {format(new Date(purchase.purchase_date), 'PPP')}</p>
                            <p className="text-gray-700">Due Date: {format(new Date(purchase.due_date), 'PPP')}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3">Product</th>
                                    <th className="text-center py-3">Quantity</th>
                                    <th className="text-right py-3">Unit Price</th>
                                    <th className="text-right py-3">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {purchase.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-3">{item.product.name}</td>
                                        <td className="text-center py-3">{item.quantity}</td>
                                        <td className="text-right py-3">${formatNumber(item.unit_price)}</td>
                                        <td className="text-right py-3">${formatNumber(item.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-72">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${formatNumber(purchase.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax ({purchase.tax}%):</span>
                                    <span>${formatNumber((purchase.subtotal * purchase.tax) / 100)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <span>${formatNumber(purchase.discount)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                    <span>Total:</span>
                                    <span>${formatNumber(purchase.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
} 