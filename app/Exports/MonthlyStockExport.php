<?php

namespace App\Exports;

class MonthlyStockExport extends BaseExcelExport
{
    public function headings(): array
    {
        return [
            'Product Name',
            'Opening Stock',
            'Purchases',
            'Sales',
            'Closing Stock'
        ];
    }

    public function map($row): array
    {
        return [
            $row['name'],
            $row['opening_stock'],
            $row['purchases'],
            $row['sales'],
            $row['closing_stock']
        ];
    }

    protected function getView(): string
    {
        return 'exports.monthly-stock';
    }

    protected function getFileName(): string
    {
        return 'monthly_stock.pdf';
    }
} 