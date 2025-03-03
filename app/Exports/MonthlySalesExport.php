<?php

namespace App\Exports;

class MonthlySalesExport extends BaseExcelExport
{
    public function headings(): array
    {
        return [
            'Date',
            'Invoice Number',
            'Customer',
            'Total'
        ];
    }

    public function map($row): array
    {
        return [
            $row['date'],
            $row['invoice_number'],
            $row['customer'],
            $row['total']
        ];
    }

    protected function getView(): string
    {
        return 'exports.monthly-sales';
    }

    protected function getFileName(): string
    {
        return 'monthly_sales.pdf';
    }
} 