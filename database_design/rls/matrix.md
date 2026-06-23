# RLS Matrix

## Legend

| Symbol | Meaning |
|----------|----------|
| R | Read |
| C | Create |
| U | Update |
| D | Delete |
| Own | Resource owned by current user |
| Assigned | Resource belongs to properties assigned through `property_assignments` |
| All | No scope restriction |
| Public | Accessible without authentication |
| - | No access |

---

## Anonymous

| Table | Access | Scope |
|---------|---------|---------|
| profiles | - | - |
| master_organizations | R | Public |
| master_properties | R | Public |
| master_bank_accounts | - | - |
| units | R | Public |
| unit_details | R | Public |
| orders | C,R,U | By booking_code |
| order_items | R | By booking_code |
| payments | C,U | By booking_code |
| facility_assignments | R | Public |
| galleries | R | Public |
| property_assignments | - | - |

### Notes

- Can create bookings without authentication.
- Can view booking details using `booking_code`.
- Can upload payment proof using `booking_code`.
- Cannot access internal management data.

---

## Customer

| Table | Access | Scope |
|---------|---------|---------|
| profiles | R,U | Own |
| master_organizations | R | Public |
| master_properties | R | Public |
| master_bank_accounts | - | - |
| units | R | Public |
| unit_details | R | Public |
| orders | C,R | Own |
| order_items | R | Own |
| payments | C,R | Own |
| facility_assignments | R | Public |
| galleries | R | Public |
| property_assignments | - | - |

### Notes

- Inherits all Anonymous permissions.
- Ownership is determined by `orders.user_id = auth.uid()`.

---

## Staff

### Scope

Properties assigned through `property_assignments`.

| Table | Access | Scope |
|---------|---------|---------|
| profiles | R | Assigned |
| master_organizations | R | Assigned |
| master_properties | R,U | Assigned |
| master_bank_accounts | - | - |
| units | R,U | Assigned |
| unit_details | R,U | Assigned |
| orders | R,U | Assigned |
| order_items | R,U | Assigned |
| payments | R,U | Assigned |
| facility_assignments | R,U | Assigned |
| galleries | C,R,U | Assigned |
| property_assignments | R | Assigned |

### Notes

- Operational role.
- Cannot manage organizations.
- Cannot manage bank accounts.
- Cannot manage users.
- Cannot manage property assignments.
- Cannot delete business data.

---

## Manager

### Scope

Properties assigned through `property_assignments`.

| Table | Access | Scope |
|---------|---------|---------|
| profiles | R | Assigned |
| master_organizations | R | Assigned |
| master_properties | C,R,U,D | Assigned |
| master_bank_accounts | C,R,U,D | Assigned |
| units | C,R,U,D | Assigned |
| unit_details | C,R,U,D | Assigned |
| orders | C,R,U,D | Assigned |
| order_items | C,R,U,D | Assigned |
| payments | C,R,U,D | Assigned |
| facility_assignments | C,R,U,D | Assigned |
| galleries | C,R,U,D | Assigned |
| property_assignments | C,R,U,D | Assigned |

### Notes

- Branch administrator role.
- Full management of assigned properties.
- Can assign and unassign Staff within assigned properties.
- Cannot access resources outside assigned properties.
- Cannot manage organizations.
- Cannot manage administrators.
- Cannot manage platform configuration.

---

## Administrator

| Table | Access | Scope |
|---------|---------|---------|
| profiles | C,R,U | All |
| master_organizations | C,R,U,D | All |
| master_properties | C,R,U,D | All |
| master_bank_accounts | C,R,U,D | All |
| units | C,R,U,D | All |
| unit_details | C,R,U,D | All |
| orders | C,R,U,D | All |
| order_items | C,R,U,D | All |
| payments | C,R,U,D | All |
| facility_assignments | C,R,U,D | All |
| galleries | C,R,U,D | All |
| property_assignments | C,R,U,D | All |

### Additional Restrictions

- Cannot create, modify, suspend, or delete Superadmin accounts.
- Cannot create, suspend, or delete Administrator accounts.
- Can modify only their own Administrator profile.

### Notes

- Global operational administrator.
- Can manage all organizations and properties.
- Can manage users.
- Can manage user role assignments.

---

## Superadmin

| Table | Access | Scope |
|---------|---------|---------|
| profiles | C,R,U,D | All |
| master_organizations | C,R,U,D | All |
| master_properties | C,R,U,D | All |
| master_bank_accounts | C,R,U,D | All |
| units | C,R,U,D | All |
| unit_details | C,R,U,D | All |
| orders | C,R,U,D | All |
| order_items | C,R,U,D | All |
| payments | C,R,U,D | All |
| facility_assignments | C,R,U,D | All |
| galleries | C,R,U,D | All |
| property_assignments | C,R,U,D | All |

### Additional Restrictions

- Cannot create new Superadmin accounts
- Cannot modify other Superadmin accounts.
- Cannot suspend other Superadmin accounts.
- Cannot delete other Superadmin accounts.

### Notes

- Platform-level role.
- Intended for system owner and developers.
- Full access to all system resources.

### Special Superadmin Notes

The Superadmin role is reserved for platform owners and developers.

Superadmin accounts cannot be created, promoted, modified, suspended, or deleted through the application.

Any Superadmin account lifecycle management must be performed through controlled administrative procedures outside the application.

---

## Scope Definitions

### Public

Resources accessible without authentication.

Applicable tables:

- master_organizations
- master_properties
- units
- unit_details
- facility_assignments
- galleries

---

### Assigned

Resources belonging to properties mapped through:

```sql
property_assignments
```

A user can access a resource only if the resource belongs to one of their assigned properties.

---

### Own

Resources owned by the authenticated user.

Example:

```sql
orders.user_id = auth.uid()
```

---

### Booking Code Access

Anonymous users may access booking information through:

```text
booking_code
```

without requiring authentication.

Implementation details are enforced through application logic and supporting RLS policies.

---

## Design Principles

Access decisions are based on:

1. User role (`profiles.role_code`)
2. Property assignment (`property_assignments`)
3. Resource ownership (`orders.user_id`)
4. Booking code access (guest flow)

This matrix defines the intended authorization model and serves as the source of truth for RLS implementation.