# ==========================================
# MENÚ PARA LA CREACIÓN DE OBJETOS MASIVA EN ACTIVE DIRECTORY
# ==========================================

# Ruta donde tienes todos los scripts
$rutaScripts = "C:\ScriptsAD"

# Menú
function Show-Menu {
    Write-Host "============= MENU GESTION AD ============="
    Write-Host "1. Crear Unidades Organizativas"
    Write-Host "2. Crear Grupos"
    Write-Host "3. Crear Usuarios"
    Write-Host "4. Crear Equipos"
    Write-Host "5. Consultar objetos"
    Write-Host "Q. Salir"
}

# Funciones
function crear_UOs {
    Write-Host "Ejecutando alta_UnidadesOrg.ps1..."
    & "$rutaScripts\alta_UnidadesOrg.ps1"
}

function crear_Grupos {
    Write-Host "Ejecutando alta_Grupos.ps1..."
    & "$rutaScripts\alta_Grupos.ps1"
}

function crear_Usuarios {
    Write-Host "Ejecutando alta_usuarios.ps1..."
    & "$rutaScripts\alta_usuarios.ps1"
}

function crear_Equipos {
    Write-Host "Ejecutando alta_equipos.ps1..."
    & "$rutaScripts\alta_equipos.ps1"
}

function consultar_Objetos {
    if (!(Get-Module ActiveDirectory)) {
        Import-Module ActiveDirectory
    }
    Write-Host "----- USUARIOS -----"
    Get-ADUser -Filter * | Select-Object Name

    Write-Host "----- GRUPOS -----"
    Get-ADGroup -Filter * | Select-Object Name

    Write-Host "----- EQUIPOS -----"
    Get-ADComputer -Filter * | Select-Object Name
}

# Cargar módulo AD
if (!(Get-Module -Name ActiveDirectory)) {
    Import-Module ActiveDirectory
}

# ==========================================
# BUCLE PRINCIPAL
# ==========================================
do {
    Show-Menu
    $opcion = Read-Host "Selecciona una opcion"

    switch ($opcion) {

        "1" {
            crear_UOs
        }

        "2" {
            crear_Grupos
        }

        "3" {
            crear_Usuarios
        }

        "4" {
            crear_Equipos
        }

        "5" {
            consultar_Objetos
        }

        "q" {
            Write-Host "Saliendo..."
        }

        default {
            Write-Host "Opcion no valida"
        }
    }

    Pause

} while ($opcion -ne "q")