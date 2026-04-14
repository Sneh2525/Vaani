Add-Type -AssemblyName System.IO.Compression.FileSystem
$docPath = 'C:\Users\Sneh Patel\Desktop\Y\Investment_Intelligence_Blueprint_v2.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($docPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$zip.Dispose()
[xml]$xml = $content
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$paragraphs = $xml.SelectNodes('//w:p', $ns)
$text = ''
foreach ($p in $paragraphs) {
    $pText = ''
    $runs = $p.SelectNodes('.//w:t', $ns)
    foreach ($r in $runs) { $pText += $r.InnerText }
    if ($pText.Trim() -ne '') { $text += $pText + "`n" }
}
$text | Out-File 'C:\Users\Sneh Patel\Desktop\Y\doc_extracted.txt' -Encoding UTF8
Write-Host "Done - extracted $($paragraphs.Count) paragraphs"
