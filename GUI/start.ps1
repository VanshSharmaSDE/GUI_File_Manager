# Run Both Servers Script

# Open two terminals and run both servers

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "File Management Dashboard" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\backend'; Write-Host 'Backend Server' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\frontend'; Write-Host 'Frontend Server' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Both servers are starting!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host "==================================" -ForegroundColor Cyan
