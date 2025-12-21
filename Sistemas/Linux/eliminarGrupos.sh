#!/bin/bash
while IFS=, read nombre descripcion
do
  groupdel "$grupo"
  echo "Grupo $grupo eliminado"
done  < <(tail -n +2 grupos.csv)
