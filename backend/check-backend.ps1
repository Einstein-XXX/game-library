# GameLibrary Backend Status Checker
# Run this script anytime to check your backend status

Write-Host "`n=== GAMELIBRARY BACKEND STATUS ===`n" -ForegroundColor Cyan

# 1. Health Check
Write-Host "1. Health Check:" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/test" -Method GET -ErrorAction Stop
    Write-Host "   [OK] Status: $($response.StatusCode) OK" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "   Message: $($content.message)" -ForegroundColor White
} catch {
    Write-Host "   [ERROR] Backend not responding!" -ForegroundColor Red
    Write-Host "   Tip: Make sure you started it with: mvn spring-boot:run" -ForegroundColor Yellow
    exit
}

# 2. Database Status
Write-Host "`n2. Database Status:" -ForegroundColor Green
try {
    $users = Invoke-WebRequest -Uri "http://localhost:8080/api/setup/users" -Method GET -ErrorAction Stop
    $userData = $users.Content | ConvertFrom-Json
    Write-Host "   Total Users: $($userData.Count)" -ForegroundColor Cyan
    $adminCount = ($userData | Where-Object { $_.role -eq "ADMIN" }).Count
    $userCount = ($userData | Where-Object { $_.role -eq "USER" }).Count
    Write-Host "   Admins: $adminCount" -ForegroundColor Red
    Write-Host "   Users: $userCount" -ForegroundColor Blue
} catch {
    Write-Host "   [WARNING] Could not fetch users" -ForegroundColor Yellow
}

# 3. Process Info
Write-Host "`n3. Backend Process:" -ForegroundColor Green
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    $mainProcess = $javaProcesses | Where-Object { $_.WorkingSet64 -gt 100MB } | Select-Object -First 1
    if ($mainProcess) {
        $memoryMB = [math]::Round($mainProcess.WorkingSet64 / 1MB, 2)
        $uptime = (Get-Date) - $mainProcess.StartTime
        Write-Host "   Process ID: $($mainProcess.Id)" -ForegroundColor Cyan
        Write-Host "   Memory: $memoryMB MB" -ForegroundColor Cyan
        Write-Host "   Uptime: $([math]::Floor($uptime.TotalMinutes)) minutes" -ForegroundColor Cyan
    }
} else {
    Write-Host "   [ERROR] No Java process found" -ForegroundColor Red
}

# 4. Quick Endpoint Test
Write-Host "`n4. Quick Tests:" -ForegroundColor Green
Write-Host "   Testing games endpoint..." -ForegroundColor Yellow
try {
    $games = Invoke-WebRequest -Uri "http://localhost:8080/api/games" -Method GET -ErrorAction Stop
    $gameData = $games.Content | ConvertFrom-Json
    if ($gameData -is [array]) {
        Write-Host "   [OK] Games API: Working ($($gameData.Count) games)" -ForegroundColor Green
    } else {
        Write-Host "   [WARNING] Games API: Responding but no games found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   [WARNING] Games API: May require authentication" -ForegroundColor Yellow
}

Write-Host "`n=== Backend Status Check Complete ===`n" -ForegroundColor Green
Write-Host "Tip: View live logs in the terminal where you ran 'mvn spring-boot:run'" -ForegroundColor Cyan
Write-Host "Tip: Use this script anytime: .\check-backend.ps1`n" -ForegroundColor Cyan

