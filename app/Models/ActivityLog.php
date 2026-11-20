<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    //

    protected $fillable = [
        'name', 'ip_address', 'title',
    ];

    public static function record(string $name, string $title, ?string $ip = null): self
    {
        return static::create([
            'name' => $name,
            'title' => $title,
            'ip_address' => $ip ?? request()->ip(),
        ]);
    }
}
