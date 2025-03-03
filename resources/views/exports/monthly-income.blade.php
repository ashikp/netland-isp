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
                <th>Payment #</th>
                <th>Customer</th>
                <th>Invoice</th>
                <th>Method</th>
                <th style="text-align: right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $income)
                <tr>
                    <td>{{ $income['date'] }}</td>
                    <td>{{ $income['payment_number'] }}</td>
                    <td>{{ $income['customer'] }}</td>
                    <td>{{ $income['invoice'] }}</td>
                    <td>{{ $income['payment_method'] }}</td>
                    <td style="text-align: right">{{ number_format($income['amount'], 2) }}</td>
                </tr>
            @endforeach
            <tr class="total">
                <td colspan="5">Total</td>
                <td style="text-align: right">{{ number_format(collect($data)->sum('amount'), 2) }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html> 