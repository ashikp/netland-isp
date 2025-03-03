<?php

namespace App\Exports;

class MonthlyIncomeExport extends BaseExcelExport
{
    public function headings(): array
    {
        return [
            'Date',
            'Payment Number',
            'Customer',
            'Invoice',
            'Amount',
            'Payment Method'
        ];
    }

    public function map($row): array
    {
        return [
            $row['date'],
            $row['payment_number'],
            $row['customer'],
            $row['invoice'],
            $row['amount'],
            $row['payment_method']
        ];
    }

    protected function getView(): string
    {
        return 'exports.monthly-income';
    }

    protected function getFileName(): string
    {
        return 'monthly_income.pdf';
    }
} 