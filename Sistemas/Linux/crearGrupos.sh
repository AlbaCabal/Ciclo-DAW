#!/bin/bash
while IFS=, read nombre descripcion
do
  groupadd "$nombre"
  echo "Grupo $nombre creado"
done  < <(tail -n +2 grupos.csv)
