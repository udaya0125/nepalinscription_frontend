<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    //
    public function index()
    {
        // Fetch all logs, latest first
        $logs = ActivityLog::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }
}
