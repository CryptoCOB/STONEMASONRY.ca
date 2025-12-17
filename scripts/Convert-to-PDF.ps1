# Simcoe Stone - Convert Executive Report to PDF
# This script opens the HTML report in your default browser for easy PDF conversion

Write-Host "🏗️ SIMCOE STONE MASONRY - PDF CONVERSION TOOL" -ForegroundColor Green
Write-Host "=" * 60

$htmlFile = "c:\Users\16479\Desktop\Simcoe Stone\MARC_EXECUTIVE_STRATEGY_REPORT.html"
$pdfFile = "c:\Users\16479\Desktop\Simcoe Stone\MARC_EXECUTIVE_STRATEGY_REPORT.pdf"

Write-Host "📋 Opening executive strategy report in browser..." -ForegroundColor Yellow
Write-Host "File: $htmlFile" -ForegroundColor Gray

# Open the HTML file in default browser
Start-Process $htmlFile

Write-Host ""
Write-Host "🖨️ PDF CONVERSION INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "=" * 40
Write-Host "1. The report is now open in your browser"
Write-Host "2. Press Ctrl+P (or File → Print)"
Write-Host "3. In the printer dropdown, select 'Save as PDF'"
Write-Host "4. Choose 'More settings' for best results:"
Write-Host "   • Paper size: A4 or Letter"
Write-Host "   • Margins: Minimum"
Write-Host "   • Scale: 100%"
Write-Host "   • Include headers and footers: UNCHECKED"
Write-Host "5. Click 'Save' and choose location"
Write-Host ""
Write-Host "💡 Recommended filename: MARC_EXECUTIVE_STRATEGY_REPORT.pdf" -ForegroundColor Green
Write-Host ""
Write-Host "📧 Once saved, you can email the PDF to Marc!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
