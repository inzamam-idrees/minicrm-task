<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    /**
     * The employee belongs to company.
     */
    public function company()
    {
        return $this->belongsTo('App\Models\Company');
    }
}
