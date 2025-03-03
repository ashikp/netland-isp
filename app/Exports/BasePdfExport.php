<?php

namespace App\Exports;

use Barryvdh\DomPDF\Facade\Pdf;

abstract class BasePdfExport
{
    protected $data;
    protected $title;

    public function __construct($data, $title)
    {
        $this->data = $data;
        $this->title = $title;
    }

    public function download()
    {
        $pdf = PDF::loadView($this->getView(), [
            'data' => $this->data,
            'title' => $this->title
        ]);
        
        return $pdf->download($this->getFileName());
    }

    abstract protected function getView(): string;
    abstract protected function getFileName(): string;
} 