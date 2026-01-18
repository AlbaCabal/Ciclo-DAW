# ---------------------------------------------------------
# PROYECTO: Gestor Documental IES Camp de Morvedre
# SISTEMA: Windows 11
# AUTOR: Alba Vera Caballero
# Nota: Guardar archivo con codificación UTF-8 con BOM
# ---------------------------------------------------------
 

# ===================================================
#                   FUNCIONES
# ===================================================

function crearUsersYGrupos
{

  # Creación de usuarios de forma masiva.
  $file_users=Import-Csv -Path usuarios.csv
  foreach ($user in $file_users) {
    $clave=ConvertTo-SecureString $user.contrasena -AsPlainText -Force
    New-LocalUser $user.cuenta -FullName $user.nombre_completo -Password $clave -Description $user.descripcion -UserMayNotChangePassword
    Write-Host "Usuario $user.cuenta creado"
  }

  $fileUsersCsv=Read-Host cuentas.csv   
  $file_Users = Get-Content $fileUsersCsv
  foreach($linea in $file_Users) {
    REG ADD "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\SpecialAccounts\UserList" /V po"/T" REG_DWORD "/D" 0
  }


  # Creación de grupos de forma masiva.
  $file_groups=Import-Csv -Path grupos.csv
  foreach ($group in $file_groups) {
    New-LocalGroup -Name $group.nombre -Description $group.descripcion
    Write-Host "Grupo $group.nombre creado"
  }

  # Añadir usuarios a grupos de acción
  $file_groups=Import-Csv -Path gruposusers.csv
  foreach ($group in $file_groups) {
    Add-LocalGroupMember -Group $group.grupo -Member $group.usuario
    Write-Host "Usuario $($group.usuario) añadido al grupo $($group.grupo)"
  }

  # Modificación de herencia de permisos y dado permisos especificos a las carpetas
  $file_groups=Import-Csv -Path permisos.csv
  foreach ($group in $file_groups) {

    icacls $group.ruta /reset /T

    icacls $group.ruta /inheritance:d /T

    icacls $group.ruta /remove:g Usuarios
    icacls $group.ruta /remove:g "Usuarios autentificados"

    icacls $group.ruta /GRANT "$($group.gRW):(OI)(CI)(R,W)"
    if ($group.gR) {
      icacls $group.ruta /GRANT "$($group.gR):(OI)(CI)(R)"
    }

    icacls $group.ruta /GRANT "Administradores:(OI)(CI)(F)"
  }


  # Horarios de acceso por usuario
  net user Alu1eso /time:Lunes-Viernes,08:00-09:00
  net user Alu2eso /time:Lunes-Viernes,09:00-10:00
  net user Alu3eso /time:Lunes-Viernes,10:00-11:00
  net user Alu4eso /time:Lunes-Viernes,11:00-12:00

  net user Alu1bach /time:Lunes-Viernes,12:00-13:00
  net user Alu2bach /time:Lunes-Viernes,13:00-14:00

  net user Alu1daw /time:Lunes-Viernes,08:00-14:00
  net user alumnado /time:Lunes-Viernes,08:00-21:00
  net user profesorado /time:Lunes-Viernes,08:00-21:00


  Write-Host
  Write-Host "Usuarios, grupos y horarios creados correctamente"
}

function crearDirectorios
{
  # Creación de estructura de directorios
  mkdir C:\Gestor_Documental
  mkdir C:\Gestor_Documental\1ESO, C:\Gestor_Documental\2ESO, C:\Gestor_Documental\3ESO, C:\Gestor_Documental\4ESO
  mkdir C:\Gestor_Documental\1BACH, C:\Gestor_Documental\2BACH
  mkdir C:\Gestor_Documental\1DAW
  
  # Creación de archivos dentro de los directorios
  Set-Content C:\Gestor_Documental\1ESO\doc_1eso.txt "Documento 1o de ESO."
  Set-Content C:\Gestor_Documental\2ESO\doc_2eso.txt "Documento 2o de ESO."
  Set-Content C:\Gestor_Documental\3ESO\doc_3eso.txt "Documento 3o de ESO."
  Set-Content C:\Gestor_Documental\4ESO\doc_4eso.txt "Documento 4o de ESO."

  Set-Content C:\Gestor_Documental\1BACH\doc_1bach.txt "Documento 1o de Bachillerato."
  Set-Content C:\Gestor_Documental\2BACH\doc_2bach.txt "Documento 2o de Bachillerato."

  Set-Content C:\Gestor_Documental\1DAW\doc_1daw.txt "Documento 1o de CFGS DAW."
  


  Write-Host "Gestor Documental creado y permisos aplicados"

}

function borrarDirectorios
{
  Remove-Item -Path "C:\Gestor_Documental" -Recurse -Force
  Write-Host "Directorio Gestor Documental eliminado"
}

function comprobacionPermisos
{
  
  Write-Host 'COMPROBACIÓN DE PERMISOS NTFS'
  Write-Host "---------------------------------"
  Write-Host
  Write-Host "Permisos de la carpeta 1ESO"
  icacls C:\Gestor_Documental\1ESO
  Write-Host "Permisos de la carpeta 2ESO"
  icacls C:\Gestor_Documental\2ESO
  Write-Host "Permisos de la carpeta 3ESO"
  icacls C:\Gestor_Documental\3ESO
  Write-Host "Permisos de la carpeta 4ESO"
  icacls C:\Gestor_Documental\4ESO
  Write-Host "Permisos de la carpeta 1BACH"
  icacls C:\Gestor_Documental\1BACH
  Write-Host "Permisos de la carpeta 2BACH"
  icacls C:\Gestor_Documental\2BACH
  Write-Host "Permisos de la carpeta 1DAW"
  icacls C:\Gestor_Documental\1DAW

}


function mostrarMenu
{
    param (
          [string]$Titulo = 'Selección de opciones'
    )

    Clear-Host
    Get-Date -Format "dddd dd MMMM yyyy. HH:mm"
    Write-Host
    Write-Host "****************************************************"
    Write-Host "================ Gestor Documental ================"
    Write-Host "****************************************************"
    Write-Host
    Write-Host '1. Creación de usuarios y grupos locales.'
    Write-Host '2. Creación Gestor Documental y sus carpetas.'
    Write-Host '3. Borrado Gestor Documental.'
    Write-Host '4. Comprobación de permisos.'
    Write-Host 's. Presiona 's' para salir.'
    Write-Host
    Write-Host " - - - - - - - - - - - - - - - - - - - - - - - - - -"
}


# ===================================================
#             PROGRAMA PRINCIPAL
# ===================================================

do
{
    mostrarMenu
    $input = Read-Host 'Elige la opción a realizar [1-5]'
    switch ($input)
    {
          '1' {
              Clear-Host
              crearUsersYGrupos
              pause
          } '2' {
              Clear-Host
              crearDirectorios
              pause
          } '3' {
              Clear-Host
              borrarDirectorios
              pause
          } '4' {
              Clear-Host
              comprobacionPermisos
              pause
          } 's' {
              'Saliendo del script...'
              return
          }
    }
    pause
}
until ($input -eq 's')
