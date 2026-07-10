$path = 'c:\Users\ostar\Documents\Projects\triviaforge\style.css'
$content = Get-Content -Path $path -Raw
$old = @'
/* GIVE POINTS BUTTON (question page) */
.give-btn {
    margin-top: 2px;
    padding: 0px;
    font-size: 0.8rem;
    line-height: 1.2;
}
'@
$new = @'
/* GIVE POINTS BUTTON (question page) */
#question-container #participant-scores .score-box .give-btn {
    margin-top: 3px !important;
    padding: 2px 4px !important;
    font-size: 0.65rem !important;
    line-height: 1.05 !important;
    min-width: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: block !important;
    box-sizing: border-box !important;
}
'@
if ($content -notmatch [regex]::Escape($old)) {
    throw 'target block not found'
}
$content = $content -replace [regex]::Escape($old), $new, 1
Set-Content -Path $path -Value $content -Encoding utf8
Write-Output 'updated style.css'
