# Creación de usuarios de forma masiva.

$file_users=Import-Csv -Path usuarios.csv
foreach ($user in $file_users) {
  $clave=ConvertTo-SecureString $user.contrasena -AsPlainText -Force
  New-LocalUser $user.cuenta -FullName $user.nombre_completo -Password $clave -Description $user.descripcion
  Add-LocalGroupMember -Group usuarios -Member $user.cuenta
  Write-Host "Usuario $user.cuenta creado"
}