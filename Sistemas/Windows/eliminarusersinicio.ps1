# Eliminación de usuarios de forma masiva de la lista de autenticación

$fileUsersCsv=Read-Host cuentas.csv
$file_Users = Get-Content $fileUsersCsv
foreach($linea in $file_Users) {
  REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\SpecialAccounts\UserList" /V $linea "/T" REG_DWORD "/D" 0
}