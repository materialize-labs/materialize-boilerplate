<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        Permission::firstOrCreate(['name' => 'create application users']);
        Permission::firstOrCreate(['name' => 'update application users']);
        Permission::firstOrCreate(['name' => 'read application users']);
        Permission::firstOrCreate(['name' => 'delete application users']);

        Permission::firstOrCreate(['name' => 'create organization users']);
        Permission::firstOrCreate(['name' => 'update organization users']);
        Permission::firstOrCreate(['name' => 'read organization users']);
        Permission::firstOrCreate(['name' => 'delete organization users']);

        // Create roles and assign created permissions

        // this can be done as separate statements
        $role = Role::firstOrCreate(['name' => 'super-admin'])
            ->givePermissionTo(Permission::all());

        $role = Role::firstOrCreate(['name' => 'admin'])
            ->givePermissionTo(Permission::all());

        $role = Role::firstOrCreate(['name' => 'owner'])
            ->givePermissionTo([
                'create organization users',
                'update organization users',
                'read organization users',
                'delete organization users',
            ]);

        $role = Role::firstOrCreate(['name' => 'manager'])
            ->givePermissionTo([
                'create organization users',
                'update organization users',
                'read organization users',
                'delete organization users',
            ]);

        $role = Role::firstOrCreate(['name' => 'user'])
            ->givePermissionTo([
                'read organization users',
            ]);
    }
}
