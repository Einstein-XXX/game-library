# JWT Token Log Monitor
# Shows only JWT-related logs in real-time

Write-Host "`n🔐 JWT Token Log Monitor" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan
Write-Host "Monitoring JWT token validation, generation, and errors...`n" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Gray
Write-Host "─" * 60 -ForegroundColor DarkGray

$logFile = "logs\gamelibrary.log"

if (-not (Test-Path $logFile)) {
    Write-Host "❌ Log file not found: $logFile" -ForegroundColor Red
    Write-Host "💡 Make sure the backend is running first!" -ForegroundColor Yellow
    exit
}

try {
    Get-Content $logFile -Wait -Tail 100 | Where-Object { 
        $_ -match "JWT|jwt|token|Token|authentication|Authentication" 
    } | ForEach-Object {
        $line = $_
        if ($line -match "ERROR.*JWT|ERROR.*token|ERROR.*authentication") {
            Write-Host $line -ForegroundColor Red
        } elseif ($line -match "WARN.*JWT|WARN.*token|WARN.*authentication") {
            Write-Host $line -ForegroundColor Yellow
        } elseif ($line -match "INFO.*JWT|INFO.*token|INFO.*authentication") {
            Write-Host $line -ForegroundColor Cyan
        } elseif ($line -match "DEBUG.*JWT|DEBUG.*token|DEBUG.*authentication") {
            Write-Host $line -ForegroundColor Gray
        } else {
            Write-Host $line
        }
    }
} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
}

