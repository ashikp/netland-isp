<!DOCTYPE html>
<html>
<head>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
        .total { font-weight: bold; }
    </style>
</head>
<body>
    <h2>{{ $title }}</h2>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Invoice Number</th>
                <th>Customer</th>
                <th style="text-align: right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $sale)
                <tr>
                    <td>{{ $sale['date'] }}</td>
                    <td>{{ $sale['invoice_number'] }}</td>
                    <td>{{ $sale['customer'] }}</td>
                    <td style="text-align: right">{{ number_format($sale['total'], 2) }}</td>
                </tr>
            @endforeach
            <tr class="total">
                <td colspan="3">Total</td>
                <td style="text-align: right">{{ number_format(collect($data)->sum('total'), 2) }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html> 