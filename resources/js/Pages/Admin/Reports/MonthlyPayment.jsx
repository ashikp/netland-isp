import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DateFilter from '@/Components/Reports/DateFilter';
import { formatCurrency } from '@/utils';

export default function MonthlyPayment({ payments, total_in, total_out, date }) {
  return (
    <AdminLayout>
      <Head title="Monthly Payment Report" />

      <div className="max-w-7xl mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Monthly Payment Report</h1>
          <DateFilter currentDate={date} onDateChange={() => {}} />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.payment_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.type === 'supplier' ? 'Supplier Payment' : 'Customer Payment'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.entity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.account}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                    payment.type === 'supplier' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {payment.type === 'supplier' ? '-' : '+'}{formatCurrency(payment.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-medium">
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Total Payments
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  <div className="text-green-600">+{formatCurrency(total_in)}</div>
                  <div className="text-red-600">-{formatCurrency(total_out)}</div>
                  <div className="border-t mt-1 pt-1">
                    {formatCurrency(total_in - total_out)}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
} 