# Creación de grupos de forma masiva.

$file_groups=Import-Csv -Path grupos.csv   # Importa el archivo CSV y lo convierte en objetos PowerShell guardándolo en $file_groups
foreach ($group in $file_groups) {   # Bucle que recorre cada grupo de $file_groups
  New-LocalGroup -Name $group.nombre -Description $group.descripcion   # Crea un grupo local en Windows con nombre y descripción
}
