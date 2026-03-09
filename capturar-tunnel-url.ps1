# Script para capturar URL do Cloudflare Tunnel
Write-Host "Iniciando Cloudflare Tunnel..." -ForegroundColor Cyan

# Inicia cloudflared em background e captura output
$job = Start-Job -ScriptBlock {
    Set-Location "C:\Users\lucas\Documents\Github\seja-senai"
    .\cloudflared.exe tunnel --url http://localhost:8080 2>&1
}

# Aguarda até 30 segundos para a URL aparecer
$timeout = 30
$elapsed = 0
$tunnelUrl = $null

Write-Host "Aguardando URL do tunnel (max 30s)..." -ForegroundColor Yellow

while ($elapsed -lt $timeout -and !$tunnelUrl) {
    Start-Sleep -Seconds 1
    $elapsed++
    
    # Pega output do job
    $output = Receive-Job -Job $job 2>&1 | Out-String
    
    # Busca padrão da URL do tunnel
    if ($output -match 'https://[a-z0-9-]+\.trycloudflare\.com') {
        $tunnelUrl = $matches[0]
        break
    }
    
    # Mostra progresso
    if ($elapsed % 3 -eq 0) {
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
}

Write-Host ""

if ($tunnelUrl) {
    Write-Host "Tunnel ativo!" -ForegroundColor Green
    Write-Host "URL: $tunnelUrl" -ForegroundColor Cyan
    
    # Salva URL em arquivo
    $tunnelUrl | Out-File -FilePath "tunnel-url.txt" -Encoding UTF8
    
    # Retorna URL
    Write-Output $tunnelUrl
} else {
    Write-Host "Timeout: Nao foi possivel capturar URL" -ForegroundColor Red
    Write-Host "Output do cloudflared:" -ForegroundColor Yellow
    Receive-Job -Job $job 2>&1
    Stop-Job -Job $job
    Remove-Job -Job $job
    exit 1
}

# Mantém job rodando
$jobId = $job.Id
Write-Host "Tunnel rodando em background - Job ID: $jobId" -ForegroundColor Green
