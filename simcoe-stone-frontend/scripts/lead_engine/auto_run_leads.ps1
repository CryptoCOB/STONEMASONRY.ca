# Auto-run scheduler for lead generation (50/hour)
# Uses PowerShell Start-Job to keep running in background.
param(
    [int]$IntervalMinutes = 60,
    [int]$PerHourCap = 50,
    [string[]]$Cities = @("Toronto","Mississauga","Brampton","Vaughan","Markham","Richmond Hill","Oakville","Burlington")
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "Starting lead generation scheduler..." -ForegroundColor Cyan

$scriptBlock = {
    param($Root, $PerHourCap, $Cities)
    try {
        Set-Location $Root
        $python = "python"
        # If local venv exists, prefer it
        if (Test-Path "$Root\scripts\lead_engine\.venv\Scripts\python.exe") {
            $python = "$Root\scripts\lead_engine\.venv\Scripts\python.exe"
        } elseif (Test-Path "$Root\.venv\Scripts\python.exe") {
            $python = "$Root\.venv\Scripts\python.exe"
        }
        $citiesArg = ($Cities -join ' ')
        Write-Host "Invoking lead generation with cap=$PerHourCap for cities: $citiesArg"
        & $python "scripts/lead_engine/generate_leads.py" --cities $citiesArg --cap $PerHourCap | Write-Output
    } catch {
        Write-Error $_
    }
}

while ($true) {
    Write-Host "Running lead generation at $(Get-Date) ..."
    Start-Job -ScriptBlock $scriptBlock -ArgumentList (Get-Location).Path, $PerHourCap, $Cities | Out-Null
    Start-Sleep -Seconds ($IntervalMinutes * 60)
}
