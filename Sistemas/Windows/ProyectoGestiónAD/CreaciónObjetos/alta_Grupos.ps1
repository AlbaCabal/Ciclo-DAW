# ==========================================
# ALTA MASIVA DE GRUPOS DESDE CSV
# ==========================================

#Creación de variable con el dominio
$domain="dc=altamira,dc=mylocal"

#
#Creación de los grupos a partir de un fichero csv
#
$gruposCsv=Read-Host "Introduce el fichero csv de Grupos:"

#Lee el fichero proyecto-grupos.csv
$fichero = import-csv -Path $gruposCsv -delimiter "*"
foreach($linea in $fichero)
{
	New-ADGroup -Name:$linea.Name -Description:$linea.Description `
		-GroupCategory:$linea.Category `
		-GroupScope:$linea.Scope  `
		-Path:$linea.Path
}
write-Host ""
write-Host "Se han creado los grupos en el dominio $domain" -Fore green
write-Host "" 
