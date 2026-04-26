# ==========================================
# ALTA MASIVA DE USUARIOS DESDE CSV
# ==========================================

#Creación de variable con el dominio
$domain="dc=altamira,dc=mylocal"

#Comprobación de que tiene cargado el módulo Active Directory
if (!(Get-Module -Name ActiveDirectory)) {
  Import-Module ActiveDirectory #Se carga el módulo
}

$fileUsersCsv=Read-Host "Introduce el fichero csv de los usuarios:"

$fichero = import-csv -Path $fileUsersCsv -Delimiter *
						     		     
foreach($linea in $fichero)
{
	
	$passAccount=ConvertTo-SecureString $linea.Password -AsPlainText -force
	$Surnames=$linea.Surname1 +' '+$linea.Surname2
	$nameLarge=$linea.Name+' '+ $Surnames
	$email=$linea.Email
	[boolean]$Habilitado = $true
    	if($linea.Enabled -eq "N") { $Habilitado = $false }
	#Establecer los días de expiración de la cuenta (Columna del csv ExpirationAccount)
   	$ExpirationAccount = $linea.ExpirationAccount
    $timeExp = (get-date).AddDays($ExpirationAccount)

	#
	# Ejecutamos el comando para crear el usuario
	#
	New-ADUser -SamAccountName $linea.Account -UserPrincipalName $linea.Account -Name $linea.Account `
		-Surname $Surnames -DisplayName $nameLarge -GivenName $linea.Name `
		-Description "Cuenta de $nameLarge" -EmailAddress $email `
		-AccountPassword $passAccount -Enabled $Habilitado `
		-CannotChangePassword $false -ChangePasswordAtLogon $true `
		-PasswordNotRequired $false -Path $linea.Path -AccountExpirationDate $timeExp `
  		-LogonWorkstations $linea.Computer
		
  	#Establecer horario de inicio de sesión       
    $horassesion = $linea.NetTime -replace(" ","")
    net user $linea.Account /times:$horassesion 
	
	#Asignar cuenta de Usuario a Grupo
	$cnGrpAccount="Cn="+$linea.Group+","+$linea.Path
	Add-ADGroupMember -Identity $linea.Group -Members $linea.Account

	#Asignar al grupo teletrabajo las cuentas con ese permiso
   	if($linea.Teletrabajo -eq "S") {
        Add-ADGroupMember -Identity "SI-GG-Teletrabajo" -Members $linea.account
    }
	
} 
Write-Host "Se han creado los usuarios correctamente en el dominio $domain" 