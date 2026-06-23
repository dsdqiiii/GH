# Roles & Access Scope

## Roles

- anonymous
- customer (future)
- staff
- manager
- administrator
- superadmin

---

## Tables in Scope

The following tables require role-based access control and are covered by this matrix:

- profiles
- master_organizations
- master_properties
- master_bank_accounts
- units
- unit_details
- orders
- order_items
- payments
- facility_assignments
- galleries
- property_assignments

The following lookup tables are intentionally excluded because they contain static reference data and follow separate access rules:

- master_roles
- master_facilities

---

## Anonymous (Guest)

### Can

- View public organization data
- View public property data
- View public unit data
- Create booking
- View booking by booking_code
- Upload payment proof by booking_code

### Cannot

- Access admin dashboard
- View other bookings
- View internal payment data
- Delete any data

---

## Customer (Authenticated Guest)

### Can

- All Anonymous permissions
- View own booking history
- View own booking details
- View own payment status

### Cannot

- View other customer bookings
- Access admin dashboard
- Delete booking data

---

## Staff

### Scope

Properties assigned through `property_assignments`.

### Can

- View assigned organizations
- View assigned properties
- View assigned units
- View booking history for assigned properties

- Create property galleries
- Update property galleries

- Update property facility_assignments

- Update property data
- Update unit data
- Update unit details

- View payments
- Update payment verification status

- View orders
- Update orders

- View order items
- Update order items

### Cannot

- Access unassigned properties
- Manage organizations
- Manage bank accounts
- Manage users
- Manage property manager assignments
- Delete booking history

---

## Manager

### Scope

Properties assigned through `property_assignments`.

### Can

- Full management of assigned properties

- Assign and unassign staff to assigned properties

- Manage bank accounts

- Create, update, and delete facility_assignments
- Create, update, and delete galleries

- View reports

- Manage bookings
- Manage payments

### Cannot

- Access unassigned properties
- Manage organizations
- Manage administrators
- Manage platform configuration

---

## Administrator

### Can

- Full operational access across all organizations and properties
- Manage organizations
- Manage users
- Manage user role assignments
- Manage bookings
- Manage payments

### Cannot

- Assign the Superadmin role to any user
- Create, modify, suspend, or delete Superadmin accounts
- Create, suspend, or delete Administrator accounts
- Modify Administrator accounts other than their own profile

---

## Superadmin

### Can

- Full system access
- Manage administrators
- Manage all users

### Cannot

- Manage other Superadmin accounts
- Assign the Superadmin role to any user

### Superadmin Notes

The Superadmin role is reserved for platform owners and developers.

Superadmin accounts cannot be created, promoted, modified, suspended, or deleted through the application.

Any Superadmin account lifecycle management must be performed through controlled administrative procedures outside the application.

---

## Notes

### Property Access Mapping

`property_assignments` is an access-mapping table and is not exclusive to the Manager role.

Both Staff and Manager access scopes are determined through assignments stored in `property_assignments`.

### Role Hierarchy

```text
Superadmin
    ↓
Administrator
    ↓
Manager
    ↓
Staff
    ↓
Customer
    ↓
Anonymous
```

### Design Principle

Access is determined by:

1. User role (`profiles.role_code`)
2. Property assignment (`property_assignments`)
3. Resource ownership (for customer bookings)

This document defines business-level permissions. Database-level enforcement is implemented separately through Row Level Security (RLS) policies.