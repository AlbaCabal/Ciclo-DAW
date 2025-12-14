# Eliminación de usuarios de forma masiva de la lista de autenticación

$fileUsersCsv=Read-Host cuentas.csv   # Pide entrada del archivo por consola guardandolo en $fileUsersCsv
$file_Users = Get-Content $fileUsersCsv   # Lee el contenido de $fileUsersCsv y guarda el contenido en $file_Users
foreach($linea in $file_Users) {   # Hace un bucle que recorre cada línea (usuario) de $file_Users
  REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\SpecialAccounts\UserList" /V $linea "/T" REG_DWORD "/D" 0   # Modifica el Registro de Windows para cada usuario
}
