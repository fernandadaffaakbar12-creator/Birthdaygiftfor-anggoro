git checkout HEAD -- index.html script.js

$files = @('index.html', 'script.js')
foreach ($file in $files) {
    if (Test-Path $file) {
        # Read with UTF8 encoding to preserve emojis
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Color replacements
        $content = $content -replace '(?i)#ffb6c1', '#87ceeb'
        $content = $content -replace '255,\s*182,\s*193', '135, 206, 235'
        $content = $content -replace '(?i)baby-pink', 'sky-blue'
        $content = $content -replace '(?i)Baby Pink', 'Sky Blue'
        
        # User PIN edits
        $content = $content -replace 'passwordnya tanggal lahir ex kamu \+ tanggal lahir kamu', 'passwordnya tanggal + bulan jadian kita.'
        $content = $content -replace 'const SECRET_PIN = "2015";', 'const SECRET_PIN = "2612";'
        
        # Write with UTF8 encoding
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "Fixed $file"
    }
}
