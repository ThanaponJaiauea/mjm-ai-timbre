param(
    [string]$VSTPath,
    [string]$VSTHostPath
)

Write-Host "========================================="
Write-Host "  VSTHost Auto-Loader (INI Method)"
Write-Host "========================================="
Write-Host "VST: $VSTPath"
Write-Host "Host: $VSTHostPath"
Write-Host ""

# Get VSTHost directory
$VSTHostDir = Split-Path -Parent $VSTHostPath
$IniPath = Join-Path $VSTHostDir "VSTHost.ini"

Write-Host "[1/4] Backing up existing VSTHost.ini..."
if (Test-Path $IniPath) {
    $BackupPath = Join-Path $VSTHostDir "VSTHost.ini.backup"
    Copy-Item $IniPath $BackupPath -Force
    Write-Host "  ✓ Backup created: $BackupPath"
}

Write-Host "[2/4] Creating VSTHost.ini with VST path..."

# Create VSTHost.ini configuration
# VSTHost uses [Plugins] section to auto-load plugins
$IniContent = @"
[Main]
ShowSplash=0
StayOnTop=1

[Plugins]
Plugin1=$VSTPath
"@

# Write INI file with UTF-8 encoding (no BOM)
$Utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($IniPath, $IniContent, $Utf8NoBom)
Write-Host "  ✓ INI file created: $IniPath"

Write-Host "[3/4] Starting VSTHost..."
$process = Start-Process -FilePath $VSTHostPath -PassThru -ErrorAction Stop

Write-Host "[4/4] Waiting for VSTHost to load plugin..."
Start-Sleep -Seconds 5

# Check if process is still running
if ($process.HasExited) {
    Write-Error "VSTHost crashed while loading plugin"
    # Restore backup
    $BackupPath = Join-Path $VSTHostDir "VSTHost.ini.backup"
    if (Test-Path $BackupPath) {
        Copy-Item $BackupPath $IniPath -Force
        Write-Host "  ✓ INI file restored from backup"
    }
    exit 1
}

Write-Host ""
Write-Host "========================================="
Write-Host "  ✓ VSTHost Started with Plugin!"
Write-Host "========================================="
Write-Host ""
Write-Host "VSTHost should now have loaded:"
Write-Host "  $VSTPath"
Write-Host ""
Write-Host "If the VST UI doesn't appear:"
Write-Host "  • Check VSTHost window (may be behind other windows)"
Write-Host "  • The VST may be loaded but UI hidden - check VSTHost menu"
Write-Host "  • Look for the plugin in VSTHost's plugin list"
Write-Host ""
Write-Host "Note: VSTHost.ini was modified"
Write-Host "  Original backed up to: VSTHost.ini.backup"
