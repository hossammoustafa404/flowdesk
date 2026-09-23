# Org Roles and Super Admin

Inside an Organization a User has exactly one **Org Role**: Owner, Dispatcher, or Technician. **Super Admin** is platform-only: uses `admin`, never has an Organization seat, never runs tenant dispatch.

We rejected kit Membership positions `owner` / `admin` / `member` and a User Role value of `customer`. `admin` as a Role name would collide with everyday “admin” talk and with Membership. Super Admin is stored as `superadmin` where a platform flag is required. Org Role is the seat that drives the permission matrix in discovery — not a free-form permission list.
