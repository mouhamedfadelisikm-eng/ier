<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Console\Command;

Artisan::command('inspire', function (Command $command) {
    $command->comment(Illuminate\Foundation\Inspiring::quote());
})->purpose('Display an inspiring quote');
