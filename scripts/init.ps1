& $PSScriptRoot/set-paths.ps1
Write-Output $PSScriptRoot
Write-Output $env:PATH

corepack enable
corepack install -g pnpm@*
pnpm run init
pnpm run build