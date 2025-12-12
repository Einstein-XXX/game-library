# Real-time Log Monitor Script
# Usage: .\monitor-logs.ps1 [filter]
# Examples:
#   .\monitor-logs.ps1                    # Show all logs
#   .\monitor-logs.ps1 "JWT"              # Show only JWT-related logs
#   .\monitor-logs.ps1 "ERROR"             # Show only errors
#   .\monitor-logs.ps1 "userId=abc123"    # Show logs for specific user

param(
    [string]$Filter = ""
)

$logFile = "logs\gamelibrary.log"
$errorLogFile = "logs\gamelibrary-error.log"

Write-Host "`n📊 Real-Time Log Monitor" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

if ($Filter) {
    Write-Host "🔍 Filter: $Filter" -ForegroundColor Yellow
    Write-Host "`nPress Ctrl+C to stop monitoring`n" -ForegroundColor Gray
    Write-Host "─" * 60 -ForegroundColor DarkGray
} else {
    Write-Host "📝 Showing all logs" -ForegroundColor Yellow
    Write-Host "`nPress Ctrl+C to stop monitoring`n" -ForegroundColor Gray
    Write-Host "─" * 60 -ForegroundColor DarkGray
}

# Create logs directory if it doesn't exist
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Create log file if it doesn't exist
if (-not (Test-Path $logFile)) {
    New-Item -ItemType File -Path $logFile | Out-Null
}

# Function to colorize log levels
function Format-LogLine {
    param([string]$line)
    
    if ($line -match "ERROR") {
        Write-Host $line -ForegroundColor Red
    } elseif ($line -match "WARN") {
        Write-Host $line -ForegroundColor Yellow
    } elseif ($line -match "INFO") {
        Write-Host $line -ForegroundColor Cyan
    } elseif ($line -match "DEBUG") {
        Write-Host $line -ForegroundColor Gray
    } else {
        Write-Host $line
    }
}

# Monitor log file
try {
    if ($Filter) {
        Get-Content $logFile -Wait -Tail 50 | Where-Object { $_ -match $Filter } | ForEach-Object {
            Format-LogLine $_
        }
    } else {
        Get-Content $logFile -Wait -Tail 50 | ForEach-Object {
            Format-LogLine $_
        }
    }
} catch {
    Write-Host "`n❌ Error monitoring logs: $_" -ForegroundColor Red
    Write-Host "💡 Make sure the backend is running and logs directory exists" -ForegroundColor Yellow
}

