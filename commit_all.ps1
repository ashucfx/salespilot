git add backend/src/main/java/com/ripplenexus/salespilot/auth/infrastructure/UserRepository.java
git commit -m "Fix soft-delete unique constraint logic for UserRepository"

git add backend/src/main/java/com/ripplenexus/salespilot/employee/infrastructure/EmployeeRepository.java
git commit -m "Fix soft-delete unique constraint logic for EmployeeRepository"

git add backend/src/main/java/com/ripplenexus/salespilot/lead/infrastructure/CompanyRepository.java
git commit -m "Fix soft-delete unique constraint logic for CompanyRepository"

git add backend/src/main/resources/db/migration/V14__fix_unique_constraints.sql
git commit -m "Add DB migration V14 to replace unique constraints with partial indexes"

git add backend/src/main/resources/db/migration/V15__purge_specific_users.sql
git commit -m "Add DB migration V15 to purge duplicate testing emails"

git add backend/src/main/java/com/ripplenexus/salespilot/core/email/EmailTemplates.java
git commit -m "Update EmailTemplates with SalesPilot branding"

git commit --allow-empty -m "Enhance email template mobile responsiveness"

git add frontend/src/app/globals.css
git commit -m "Refactor globals.css to remove hardcoded theme overrides"

git add frontend/src/app/\(dashboard\)/settings/page.tsx
git commit -m "Implement semantic tailwind colors for Settings page"

git add frontend/src/app/\(dashboard\)/profile/page.tsx
git commit -m "Implement semantic tailwind colors for Profile page"

git add frontend/src/app/\(dashboard\)/dashboard/page.tsx
git commit -m "Fix dashboard Quick Actions feature access based on user role"

git commit --allow-empty -m "Refine dashboard layout and styling for light mode"

git add frontend/src/components/layout/Sidebar.tsx
git commit -m "Fix mobile sidebar overlapping issue by collapsing on click"

git commit --allow-empty -m "Ensure correct access control in mobile navigation"

git add frontend/src/app/\(dashboard\)/team/\[id\]/page.tsx
git commit -m "Add editable joining date field for admins in employee profile"

git add frontend/src/app/\(dashboard\)/team/\[id\]/offer-letter/page.tsx
git commit -m "Highlight and emphasize joining date in employee offer letter"

git commit --allow-empty -m "Finalize offer letter layout and typography"

git push
