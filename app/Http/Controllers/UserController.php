<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'is_approved' => ['nullable', 'string', 'in:pending,approved,rejected'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $perPage = (int) $request->input('per_page', 10);

        $users = User::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = trim($request->input('search'));
                // Escape LIKE wildcards so user input is matched literally
                $term = addcslashes($term, '%_\\');

                $query->where(function ($q) use ($term) {
                    $q->where('name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%")
                        ->orWhere('role', 'like', "%{$term}%")
                        ->orWhere('city', 'like', "%{$term}%")
                        ->orWhere('country', 'like', "%{$term}%")
                        ->orWhere('affiliated_institution', 'like', "%{$term}%");
                });
            })
            ->when($request->filled('is_approved'), function ($query) use ($request) {
                $query->where('is_approved', $request->input('is_approved'));
            })
            ->latest()
            ->paginate($perPage);

        return response()->json($users);
    }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name' => ['required', 'string', 'max:255'],
    //         'email' => ['required', 'email', 'max:255', 'unique:users,email'],
    //         'password' => ['required', 'string', 'min:8'],
    //         'city' => ['nullable', 'string', 'max:255'],
    //         'country' => ['nullable', 'string', 'max:255'],
    //         'role' => ['required', 'string', 'max:255'],
    //         'affiliated_institution' => ['nullable', 'string', 'max:255'],
    //         'is_approved' => ['nullable', 'string', 'in:pending,approved,rejected'],
    //         'image' => ['nullable', 'file', 'mimes:png,jpg,jpeg,gif,webp', 'max:2048'],
    //     ]);

    //     unset($validated['image']);
    //     if ($request->hasFile('image')) {
    //         $validated['image'] = $request->file('image')->store('users', 'public');
    //     }

    //     $validated['is_approved'] = $validated['is_approved'] ?? 'pending';

    //     $user = User::create($validated);

    //     return response()->json([
    //         'message' => 'User created successfully.',
    //         'user' => $user,
    //     ], 201);
    // }

        public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'affiliated_institution' => ['nullable', 'string', 'max:255'],
            'is_approved' => ['nullable', 'string', 'in:pending,approved,rejected'],
            'image' => ['nullable', 'file', 'mimes:png,jpg,jpeg,gif,webp', 'max:2048'],
        ]);

        unset($validated['image']);
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('users', 'public');
        }

        $validated['is_approved'] = $validated['is_approved'] ?? 'pending';

        $user = User::create($validated);

        ActivityLog::record(
            $request->user()->name,
            "Created user {$user->name} ({$user->email}) with role {$user->role} and approval status {$user->is_approved}",
            $request->ip()
        );

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user,
        ], 201);
    }

    // public function update(Request $request, User $user)
    // {
    //     $validated = $request->validate([
    //         'name' => ['sometimes', 'required', 'string', 'max:255'],
    //         'email' => [
    //             'sometimes', 'required', 'email', 'max:255',
    //             Rule::unique('users', 'email')->ignore($user->id),
    //         ],
    //         'password' => ['sometimes', 'nullable', 'string', 'min:8'],
    //         'city' => ['sometimes', 'nullable', 'string', 'max:255'],
    //         'country' => ['sometimes', 'nullable', 'string', 'max:255'],
    //         'role' => ['sometimes', 'required', 'string', 'max:255'],
    //         'affiliated_institution' => ['sometimes', 'nullable', 'string', 'max:255'],
    //         'is_approved' => ['sometimes', 'nullable', 'string', 'in:pending,approved,rejected'],
    //         'image' => ['sometimes', 'nullable', 'file', 'mimes:png,jpg,jpeg,gif,webp', 'max:2048'],
    //     ]);

    //     if (empty($validated['password'])) {
    //         unset($validated['password']);
    //     }

    //     unset($validated['image']);
    //     if ($request->hasFile('image')) {
    //         if ($user->image) {
    //             Storage::disk('public')->delete($user->image);
    //         }
    //         $validated['image'] = $request->file('image')->store('users', 'public');
    //     }

    //     $oldStatus = $user->is_approved;

    //     $user->update($validated);

    //     // Log only when the approval status actually changed.
    //     if ($user->wasChanged('is_approved')) {
    //         ActivityLog::record(
    //             $request->user()->name,
    //             "Changed approval status of {$user->name} ({$user->email}) from {$oldStatus} to {$user->is_approved}",
    //             $request->ip()
    //         );
    //     }

    //     return response()->json([
    //         'message' => 'User updated successfully.',
    //         'user' => $user->fresh(),
    //     ]);
    // }

        public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes', 'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['sometimes', 'nullable', 'string', 'min:8'],
            'city' => ['sometimes', 'nullable', 'string', 'max:255'],
            'country' => ['sometimes', 'nullable', 'string', 'max:255'],
            'role' => ['sometimes', 'required', 'string', 'max:255'],
            'affiliated_institution' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_approved' => ['sometimes', 'nullable', 'string', 'in:pending,approved,rejected'],
            'image' => ['sometimes', 'nullable', 'file', 'mimes:png,jpg,jpeg,gif,webp', 'max:2048'],
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        unset($validated['image']);
        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $validated['image'] = $request->file('image')->store('users', 'public');
        }

        $oldStatus = $user->is_approved;
        $original = $user->getOriginal();

        $user->update($validated);

        $actor = $request->user()->name;
        $ip = $request->ip();

        // Log 1: approval status change.
        if ($user->wasChanged('is_approved')) {
            ActivityLog::record(
                $actor,
                "Changed approval status of {$user->name} ({$user->email}) from {$oldStatus} to {$user->is_approved}",
                $ip
            );
        }

        // Log 2: all other field changes, in a single entry.
        $changes = collect($user->getChanges())->except(['is_approved', 'updated_at']);

        if ($changes->isNotEmpty()) {
            $details = $changes->map(function ($new, $field) use ($original) {
                // Never write sensitive/opaque values to the log.
                if (in_array($field, ['password', 'image'], true)) {
                    return "{$field} changed";
                }

                $old = $original[$field] ?? 'empty';
                $new = $new ?? 'empty';

                return "{$field}: {$old} → {$new}";
            })->implode(', ');

            ActivityLog::record(
                $actor,
                "Updated user {$user->name} ({$user->email}): {$details}",
                $ip
            );
        }

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user->fresh(),
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        if ($user->image) {
            Storage::disk('public')->delete($user->image);
        }

        $deletedName = $user->name;
        $deletedEmail = $user->email;

        $user->delete();

        ActivityLog::record(
            $request->user()->name,
            "Deleted user {$deletedName} ({$deletedEmail})",
            $request->ip()
        );

        return response()->json(['message' => 'User deleted successfully.']);
    }
}
