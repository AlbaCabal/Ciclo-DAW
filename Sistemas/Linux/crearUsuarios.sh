#!/bin/bash
while IFS=, read cuenta password descripcion nombreCompleto grupo
do
  useradd -m -d /home/"$cuenta" -s /bin/bash -c "$nombreCompleto - $descripcion" -g "$grupo" "$cuenta"
  echo "$cuenta:$password" | chpasswd
  
  chage -d0 "$cuenta"
  
  echo "Usuario $cuenta creado"
done  < <(tail -n +2 usuarios.csv)
