import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DateFilter from '@/Components/Reports/DateFilter';
import { formatCurrency } from '@/utils';

export default function MonthlyAccountsBalance({ accounts, date }) {
  return (
    <AdminLayout>
      <Head title="Monthly Accounts Balance Report" />

      <div className="max-w-7xl mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Monthly Accounts Balance Report</h1>
          <DateFilter currentDate={date} onDateChange={() => {}} />
        </div>

        {accounts.map((account, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold">{account.name}</h2>
              <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                <div>
                  <span className="text-gray-500">Opening Balance:</span>
                  <span className="ml-2 font-medium">{formatCurrency(account.opening_balance)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Credits:</span>
                  <span className="ml-2 font-medium text-green-600">+{formatCurrency(account.credits)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Debits:</span>
                  <span className="ml-2 font-medium text-red-600">-{formatCurrency(account.debits)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Closing Balance:</span>
                  <span className="ml-2 font-medium">{formatCurrency(account.closing_balance)}</span>
                </div>
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {account.transactions.map((transaction, tIndex) => (
                  <tr key={tIndex} className={tIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                      {transaction.type === 'credit' ? formatCurrency(transaction.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                      {transaction.type === 'debit' ? formatCurrency(transaction.amount) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
} 