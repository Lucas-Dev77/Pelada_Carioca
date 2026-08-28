# Baixa as imagens do site para assets/img e troca os enderecos remotos
# pelos caminhos locais em index.html e css/style.css.
# Uso:  powershell -ExecutionPolicy Bypass -File .\baixar-imagens.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

$destino = Join-Path $PSScriptRoot "assets\img"
New-Item -ItemType Directory -Force -Path $destino | Out-Null

$mapa = [ordered]@{
  "photo-1657579431507-6fcedaac0d1e" = "hero"
  "photo-1568809391772-503bcd521202" = "slide-1"
  "photo-1562515269-5e2b4953d2d6"    = "slide-2"
  "photo-1612151387840-62fb3b521841" = "slide-3"
  "photo-1654002932135-4df39d0ebc52" = "post-1"
  "photo-1491488746893-68aa619cfb8f" = "post-2"
  "photo-1671065340989-cdae41f15d48" = "post-3"
  "photo-1577416382952-9b5a3d5e3885" = "pelada-1"
  "photo-1649030608885-fb70fea013dc" = "pelada-2"
  "photo-1545316932-569f8410271c"    = "pelada-3"
  "photo-1430254769815-4c7b54757b5b" = "pelada-4"
  "photo-1654000672527-5931eb449dbe" = "galeria-1"
  "photo-1615000180486-64d23d1dce7d" = "galeria-2"
  "photo-1576369897787-d6fbee93316d" = "galeria-3"
}

foreach ($id in $mapa.Keys) {
  $nome    = $mapa[$id]
  $arquivo = Join-Path $destino "$nome.jpg"
  $url     = "https://images.unsplash.com/$id" + "?auto=format&fit=crop&w=1600&q=80"
  Write-Host "Baixando $nome ..." -NoNewline
  try {
    Invoke-WebRequest -Uri $url -OutFile $arquivo -UseBasicParsing
    Write-Host " ok"
  } catch {
    Write-Host " FALHOU ($($_.Exception.Message))" -ForegroundColor Red
  }
}

function Trocar($caminho, $prefixo) {
  if (-not (Test-Path $caminho)) { return }
  $txt = Get-Content $caminho -Raw -Encoding UTF8
  foreach ($id in $mapa.Keys) {
    $nome = $mapa[$id]
    $txt  = [regex]::Replace($txt, "https://images\.unsplash\.com/$id[^`"')]*", "$prefixo$nome.jpg")
  }
  Set-Content $caminho $txt -Encoding UTF8 -NoNewline
  Write-Host "Atualizado: $caminho"
}

Trocar (Join-Path $PSScriptRoot "index.html")     "assets/img/"
Trocar (Join-Path $PSScriptRoot "css\style.css")  "../assets/img/"

Write-Host ""
Write-Host "Pronto. O site agora roda offline." -ForegroundColor Green
