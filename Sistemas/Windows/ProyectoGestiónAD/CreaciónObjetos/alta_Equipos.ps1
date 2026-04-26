# ==========================================
# ALTA MASIVA DE EQUIPOS DESDE CSV
# ==========================================

#Creación de variable con el dominio
$domain="dc=altamira,dc=mylocal"

#
#Creación de los equipos a partir de un fichero csv
#
#Lee el fichero proyecto-equipos.csv. El carácter delimitador de columna es *
$equiposCsv=Read-Host "Introduce el fichero csv de Equipos:"
$fichero= import-csv -Path $equiposCsv -delimiter "*"

foreach($line in $fichero)
{
	New-ADComputer -Enabled:$true -Name:$line.Computer -Path:$line.Path -SamAccountName:$line.Computer
}

write-Host ""
write-Host "Se han creado los equipos en el dominio $domain" -Fore green
write-Host "" 
