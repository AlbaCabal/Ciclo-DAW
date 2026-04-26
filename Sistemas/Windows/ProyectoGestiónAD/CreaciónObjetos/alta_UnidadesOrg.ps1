# ==========================================
# ALTA MASIVA DE UNIDADES ORGANIZATIVAS DESDE CSV
# ==========================================

#Creación de variable con el dominio
$domain="dc=altamira,dc=mylocal"

#Creación de los equipos a partir de un fichero csv
$ficheroCsvUO=Read-Host "Introduce el fichero csv de UO's:"

$fichero = import-csv -Path $ficheroCsvUO -delimiter "*"

#Lee el fichero proyecto-UO.csv
foreach($line in $fichero)
{
    New-ADOrganizationalUnit -Description:$line.Description -Name:$line.Name `
		-Path $line.Path -ProtectedFromAccidentalDeletion $true
     
}
Write-Host "Se han creado las UOs satisfactoriamente en el dominio $domain"
