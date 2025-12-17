# PowerShell script to verify the Simcoe Stone build and log information
# This script doesn't start a server but logs details about the build for verification

$logFile = "C:\Users\16479\Desktop\Simcoe Stone\build-verification.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$buildDir = "C:\Users\16479\Desktop\Simcoe Stone\simcoe-stone-frontend\build"

"[$timestamp] Simcoe Stone Frontend - Build Verification Log" | Out-File -FilePath $logFile

# Log system information
"[$timestamp] System Information:" | Out-File -FilePath $logFile -Append
"- OS: $($PSVersionTable.OS)" | Out-File -FilePath $logFile -Append
"- PowerShell Version: $($PSVersionTable.PSVersion)" | Out-File -FilePath $logFile -Append

# Check if build directory exists
if (Test-Path -Path $buildDir) {
    "[$timestamp] Build directory exists at: $buildDir" | Out-File -FilePath $logFile -Append
    
    # Count files in build directory
    $fileCount = (Get-ChildItem -Path $buildDir -Recurse -File).Count
    "[$timestamp] Build contains $fileCount files" | Out-File -FilePath $logFile -Append
    
    # Check for key files
    $keyFiles = @(
        "index.html",
        "manifest.json",
        "robots.txt",
        "_redirects"
    )
    
    "[$timestamp] Checking for key files:" | Out-File -FilePath $logFile -Append
    foreach ($file in $keyFiles) {
        $filePath = Join-Path -Path $buildDir -ChildPath $file
        if (Test-Path -Path $filePath) {
            "- ✅ $file exists" | Out-File -FilePath $logFile -Append
            
            # For HTML files, check for key SEO elements
            if ($file -eq "index.html") {
                $content = Get-Content -Path $filePath -Raw
                
                "[$timestamp] Checking SEO elements in index.html:" | Out-File -FilePath $logFile -Append
                
                $seoElements = @(
                    @{Name="Title tag"; Pattern='<title>.*?</title>'},
                    @{Name="Meta description"; Pattern='<meta name="description"'},
                    @{Name="Viewport"; Pattern='<meta name="viewport"'},
                    @{Name="Canonical URL"; Pattern='<link rel="canonical"'},
                    @{Name="Open Graph tags"; Pattern='<meta property="og:'}
                )
                
                foreach ($element in $seoElements) {
                    if ($content -match $element.Pattern) {
                        "- ✅ $($element.Name) found" | Out-File -FilePath $logFile -Append
                    } else {
                        "- ❌ $($element.Name) not found" | Out-File -FilePath $logFile -Append
                    }
                }
            }
            
            # For robots.txt, check content
            if ($file -eq "robots.txt") {
                $content = Get-Content -Path $filePath -Raw
                "[$timestamp] robots.txt content:" | Out-File -FilePath $logFile -Append
                $content | Out-File -FilePath $logFile -Append
            }
        } else {
            "- ❌ $file does not exist" | Out-File -FilePath $logFile -Append
        }
    }
    
    # Check static directory
    $staticDir = Join-Path -Path $buildDir -ChildPath "static"
    if (Test-Path -Path $staticDir) {
        $jsFiles = (Get-ChildItem -Path $staticDir -Recurse -Filter "*.js").Count
        $cssFiles = (Get-ChildItem -Path $staticDir -Recurse -Filter "*.css").Count
        
        "[$timestamp] Static assets:" | Out-File -FilePath $logFile -Append
        "- ✅ $jsFiles JavaScript files" | Out-File -FilePath $logFile -Append
        "- ✅ $cssFiles CSS files" | Out-File -FilePath $logFile -Append
    } else {
        "[$timestamp] ❌ Static directory does not exist" | Out-File -FilePath $logFile -Append
    }
    
    # Check images directory
    $imagesDir = Join-Path -Path $buildDir -ChildPath "images"
    if (Test-Path -Path $imagesDir) {
        $imageCount = (Get-ChildItem -Path $imagesDir -Recurse -File).Count
        "[$timestamp] Images directory contains $imageCount files" | Out-File -FilePath $logFile -Append
    }
    
    # Verification summary
    "[$timestamp] Build verification complete. The build appears to be ready for deployment." | Out-File -FilePath $logFile -Append
    "[$timestamp] To view the site, open: file:///$($buildDir -replace '\\', '/')/index.html" | Out-File -FilePath $logFile -Append
    
} else {
    "[$timestamp] ❌ ERROR: Build directory not found at: $buildDir" | Out-File -FilePath $logFile -Append
    "[$timestamp] Please run 'npm run build' in the frontend directory first." | Out-File -FilePath $logFile -Append
}

# Print confirmation
Write-Host "Build verification complete. Log saved to: $logFile"
Write-Host "To view the site in a browser, open: file:///$($buildDir -replace '\\', '/')/index.html"
