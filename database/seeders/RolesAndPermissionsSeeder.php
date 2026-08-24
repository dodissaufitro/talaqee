<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define models for which we want to generate CRUD permissions
        $models = [
            'Author',
            'BookChapter',
            'Download',
            'Favorite',
            'Mission',
            'Notification',
            'PlaylistItem',
            'Review',
            'User'
        ];

        // Define standard CRUD actions
        $actions = ['view_any', 'view', 'create', 'update', 'delete', 'restore', 'force_delete'];

        // Create permissions
        foreach ($models as $model) {
            foreach ($actions as $action) {
                $permissionName = $action . '_' . strtolower($model);
                Permission::firstOrCreate(['name' => $permissionName]);
            }
        }

        // Create roles and assign created permissions

        // 1. Super Admin: gets all permissions
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // 2. Editor: can manage content but not users
        $editor = Role::firstOrCreate(['name' => 'editor']);
        $editorPermissions = Permission::where('name', 'not like', '%user%')
                                       ->where('name', 'not like', 'force_delete%')
                                       ->get();
        $editor->givePermissionTo($editorPermissions);

        // 3. User: standard user, can view and create some stuff
        $userRole = Role::firstOrCreate(['name' => 'user']);
        // Assign specific permissions to the standard user
        // Example: can view authors, create favorites, etc.
        $userPermissions = [
            'view_any_author', 'view_author',
            'view_any_bookchapter', 'view_bookchapter',
            'view_any_review', 'view_review', 'create_review',
            'view_any_favorite', 'view_favorite', 'create_favorite', 'delete_favorite',
            'view_any_playlistitem', 'view_playlistitem', 'create_playlistitem', 'delete_playlistitem',
            'view_any_download', 'view_download', 'create_download',
        ];
        foreach ($userPermissions as $permName) {
            $userRole->givePermissionTo($permName);
        }
    }
}
