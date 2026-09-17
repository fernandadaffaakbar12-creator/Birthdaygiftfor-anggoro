$files = @('index.html', 'style.css', 'script.js')
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace '(?i)#ffb6c1', '#87ceeb'
        $content = $content -replace '255,\s*182,\s*193', '135, 206, 235'
        $content = $content -replace '(?i)baby-pink', 'sky-blue'
        $content = $content -replace '(?i)Baby Pink', 'Sky Blue'
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "Updated $file"
    }
}
