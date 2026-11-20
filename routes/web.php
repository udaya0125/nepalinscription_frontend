<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

    Route::get('/', function () {
     return Inertia::render('MainPages/Welcome');
    });

Route::get('/inscriptions', function () {
    return Inertia::render('MainPages/Inscriptions');
});

Route::get('/{slug}/details', function ($slug) {
    return Inertia::render('MainPages/InscriptionsDetails', [
        'slug' => $slug,
    ]);
})->name('inscriptions.details');

// Route::get(
//     '/palaeographical/{categorySlug?}/{subCategorySlug?}/{childCategorySlug?}',
//     function ($categorySlug = null, $subCategorySlug = null, $childCategorySlug = null) {
//         return Inertia::render('MainPages/Palaeographical', [
//             'categorySlug' => $categorySlug,
//             'subCategorySlug' => $subCategorySlug,
//             'childCategorySlug' => $childCategorySlug,
//         ]);
//     }
// )->name('palaeographical');

Route::get('/palaeographical/{categorySlug?}/{subCategorySlug?}/{childCategorySlug?}', function () {
    return Inertia::render('MainPages/Palaeographical');
});

Route::get('/terms', function () {
    return Inertia::render('MainPages/TermsAndConditions');
})->name('terms');

Route::fallback(function () {
    return Inertia::render('MainPages/NotFound')->toResponse(request())->setStatusCode(404);
});

Route::get('/publication', function () {
    return Inertia::render('MainPages/Comingsoon', [
        'pageName' => 'Publication',
    ]);
})->name('publication');

Route::get('/gallery', function () {
    return Inertia::render('MainPages/Comingsoon', [
        'pageName' => 'Gallery',
    ]);
})->name('gallery');

Route::get('/partners', function () {
    return Inertia::render('MainPages/Comingsoon', [
        'pageName' => 'Partners',
    ]);
})->name('partners');

Route::get('/events', function () {
    return Inertia::render('MainPages/Comingsoon', [
        'pageName' => 'Event',
    ]);
})->name('events');

Route::get('/team', function () {
    return Inertia::render('MainPages/Comingsoon', [
        'pageName' => 'Team',
    ]);
})->name('team');

Route::get('/about', function () {
    return Inertia::render('MainPages/Comingsoon', [
        'pageName' => 'About',
    ]);
})->name('about');

Route::get('/ourusers', [UserController::class, 'index'])->name('ourusers.index');
Route::post('/ourusers', [UserController::class, 'store'])->name('ourusers.store');
Route::put('/ourusers/{user}', [UserController::class, 'update'])->name('ourusers.update');
Route::delete('/ourusers/{user}', [UserController::class, 'destroy'])->name('ourusers.destroy');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin-dashboard', function () {
        return Inertia::render('AdminPages/Dashboard');
    });

    Route::get('/activity-logs', function () {
        return Inertia::render('AdminPages/ActivityLogs');
    });

    Route::get('/user-management', function () {
        return Inertia::render('AdminPages/UserManagement');
    });
});

Route::get('/ourlogs', [ActivityLogController::class, 'index'])->name('ourlogs.index');

// Route::get('/ournotifications', [NotificationController::class, 'index'])->name('ournotifications.index');
// Route::patch('/ournotifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('ournotifications.mark-all-as-read');
// Route::patch('/ournotifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('ournotifications.mark-as-read');

Route::get('/ournotifications', [NotificationController::class, 'index'])->name('ournotifications.index');
Route::patch('/ournotifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('ournotifications.mark-all-as-read');
Route::patch('/ournotifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('ournotifications.mark-as-read');
Route::delete('/ournotifications/{notification}', [NotificationController::class, 'destroy'])->name('ournotifications.destroy');

require __DIR__.'/auth.php';
