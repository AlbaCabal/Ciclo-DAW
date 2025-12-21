# Creación de usuarios de forma masiva.

$file_users=Import-Csv -Path usuarios.csv   # Importa el archivo CSV como objetos PowerShell guardándolo en $file_users
foreach ($user in $file_users) {   # Bucle que recorre cada usuario de $file_users
  $clave=ConvertTo-SecureString $user.contrasena -AsPlainText -Force   # Convierte la contraseña en un SecureString guardándolo en $clave
  New-LocalUser $user.cuenta -FullName $user.nombre_completo -Password $clave -Description $user.descripcion   # Crea el usuario local en Windows con nombre, nombre completo, contraseña y descripción
  Add-LocalGroupMember -Group usuarios -Member $user.cuenta   # Agrega el usuario al grupo local “usuarios”

  # Forzar cambio de contraseña en el primer inicio
  $localUser = Get-LocalUser -Name $user.cuenta   # Guardar el nombre del usuario en $localUser
  $localUser | Set-LocalUser -PasswordNeverExpires $false   # Contraseña sí que expira
  $localUser | Set-LocalUser -UserMayNotChangePassword $false   # El usuario puede cambiar la contraseña
  $localUser | Set-LocalUser -PasswordExpired $true   # Esta línea fuerza el cambio al primer inicio
  
  Write-Host "Usuario $user.cuenta creado"   # Muestra un mensaje en la consola
}
