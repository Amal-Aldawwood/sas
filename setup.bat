@echo off
echo Setting up project structure...

REM Admin routes
mkdir "app\(admin)\dashboard"
mkdir "app\(admin)\tenants\create"
mkdir "app\(admin)\tenants\[id]\edit"

REM Customer routes
mkdir "app\(customer)\[tenant]\dashboard"
mkdir "app\(customer)\[tenant]\login"
mkdir "app\(customer)\[tenant]\users"

REM API routes
mkdir "app\api\admin\tenants"
mkdir "app\api\[tenant]\auth"
mkdir "app\api\[tenant]\data"

REM Other directories
mkdir "app\lib"
mkdir "app\components"
mkdir "app\components\ui"
mkdir "app\hooks"
mkdir "app\types"
mkdir "app\middleware"

echo Project structure set up successfully!
