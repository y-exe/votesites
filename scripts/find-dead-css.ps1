$ErrorActionPreference = "Stop"

$css = Get-Content "src\app\globals.css" -Raw
$classMatches = [regex]::Matches($css, '\.([a-zA-Z][a-zA-Z0-9_-]*)')

$classNames = @{}
foreach ($m in $classMatches) {
    $classNames[$m.Groups[1].Value] = $true
}

$bases = @{}
foreach ($c in $classNames.Keys) {
    $base = ($c -split '--')[0]
    $bases[$base] = $true
}

$allSource = (Get-ChildItem -Recurse -Path "src" -Include *.tsx, *.ts | Get-Content -Raw) -join "`n"

$notFound = @()
foreach ($b in ($bases.Keys | Sort-Object)) {
    if ($allSource -notmatch [regex]::Escape($b)) {
        $notFound += $b
    }
}

Write-Output "CSS base classes NOT found in src: $($notFound.Count)"
foreach ($b in $notFound) {
    Write-Output "  $b"
}
