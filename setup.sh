#!/bin/bash

echo "íº€ Setting up project structure..."

# Admin routes
mkdir -p "app/(admin)/dashboard"
mkdir -p "app/(admin)/tenants/create"
mkdir -p "app/(admin)/tenants/[id]/edit"

# Customer routes  
mkdir -p "app/(customer)/[tenant]/dashboard"
mkdir -p "app/(customer)/[tenant]/login"
mkdir -p "app/(customer)/[tenant]/users"

# API routes
mkdir -p "app/api/admin/tenants"
mkdir -p "app/api/[tenant]/auth"
mkdir -p "app/api/[tenant]/data"

# Other folders
mkdir -p lib components/ui hooks types

# Create basic files
touch middleware.ts
touch "app/(admin)/dashboard/page.tsx"
touch "app/(admin)/tenants/create/page.tsx"
touch "app/(customer)/[tenant]/dashboard/page.tsx"
touch "app/(customer)/[tenant]/login/page.tsx"

echo "âœ… Project structure created successfully!"
echo "í³ Created folders:"
tree app -L 3 2>/dev/null || find app -type d

