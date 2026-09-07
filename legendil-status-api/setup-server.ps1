# Legend-IL Status API — one-shot Windows Server setup.
#
# Run this in PowerShell (as Administrator, needed for the pm2/cloudflared
# install steps) from inside the legendil-status-api folder:
#   powershell -ExecutionPolicy Bypass -File setup-server.ps1
#
# Requires Node.js already installed (node -v to check; get it from
# https://nodejs.org if missing — pick the LTS Windows installer).

$ErrorActionPreference = "Stop"

Write-Host "== 1/5: Installing dependencies ==" -ForegroundColor Cyan
npm install

Write-Host "== 2/5: Preparing .env ==" -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"

    # Generate a random 64-char hex token without needing openssl.
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $token = ($bytes | ForEach-Object { $_.ToString("x2") }) -join ""

    (Get-Content ".env") -replace "STATUS_API_TOKEN=change-me", "STATUS_API_TOKEN=$token" | Set-Content ".env"

    Write-Host "Generated a random STATUS_API_TOKEN for you:" -ForegroundColor Yellow
    Write-Host "  $token" -ForegroundColor Yellow
    Write-Host "IMPORTANT: put this same value into Velocity's config.properties as api-token." -ForegroundColor Yellow
} else {
    Write-Host ".env already exists — leaving it as-is."
}

Write-Host "== 3/5: Building ==" -ForegroundColor Cyan
npm run build

Write-Host "== 4/5: Starting with pm2 ==" -ForegroundColor Cyan
if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    npm install -g pm2
    npm install -g pm2-windows-startup
    pm2-startup install
}
pm2 delete legendil-status-api 2>$null
pm2 start dist/index.js --name legendil-status-api
pm2 save

Write-Host "== 5/5: Installing cloudflared and starting a tunnel ==" -ForegroundColor Cyan
if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    $cloudflaredPath = "$env:ProgramFiles\cloudflared\cloudflared.exe"
    New-Item -ItemType Directory -Force -Path "$env:ProgramFiles\cloudflared" | Out-Null
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile $cloudflaredPath
    $env:Path += ";$env:ProgramFiles\cloudflared"
} else {
    $cloudflaredPath = "cloudflared"
}

$envContent = Get-Content ".env" | Where-Object { $_ -match "^PORT=" }
$port = if ($envContent) { ($envContent -split "=")[1].Trim() } else { "3001" }

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Green
Write-Host " Setup done. Starting the Cloudflare tunnel now." -ForegroundColor Green
Write-Host " Copy the https://....trycloudflare.com URL it prints below —" -ForegroundColor Green
Write-Host " that goes into Netlify's VITE_STATUS_API_URL." -ForegroundColor Green
Write-Host " Press Ctrl+C to stop the tunnel when you're done testing." -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host ""
& $cloudflaredPath tunnel --url "http://localhost:$port"
