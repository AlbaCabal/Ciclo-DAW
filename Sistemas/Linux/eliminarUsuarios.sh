#!/bin/bash
while IFS=, read cuenta password descripcion nombreCompleto grupo
do
  userdel -r "$cuenta"
  echo "Usuario $cuenta eliminado" 
done  < <(tail -n +2 usuarios.csv)
