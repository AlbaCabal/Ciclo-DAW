@echo off
net use W: /delete /y >nul 2>&1
net use X: /delete /y >nul 2>&1
net use Y: /delete /y >nul 2>&1
net use Z: /delete /y >nul 2>&1
net use * /delete /y >nul 2>&1
timeout /t 2 /nobreak >nul

REM ===== GERENCIA =====
whoami /groups | findstr /i "SI-GG-DepGerencia" >nul
if not errorlevel 1 (
    net use Y: \\altamira.mylocal\Dep-Gerencia
    net use X: \\altamira.mylocal\Dep-Datos
    net use Z: \\altamira.mylocal\Dep-Informatica
    net use W: \\altamira.mylocal\Dep-Soporte
    msg %username% "Usuario %USERNAME%, la unidad Y: es tu carpeta de GERENCIA con lectura/escritura. Las unidades X:, W: y Z: son solo lectura."
    goto shortcuts
)

REM ===== SOPORTE =====
whoami /groups | findstr /i "SI-GG-DepSoporte" >nul
if not errorlevel 1 (
    net use W: \\altamira.mylocal\Dep-Soporte
    net use X: \\altamira.mylocal\Dep-Datos
    net use Y: \\altamira.mylocal\Dep-Gerencia
    net use Z: \\altamira.mylocal\Dep-Informatica
    msg %username% "Usuario %USERNAME%, la unidad W: es tu carpeta de SOPORTE con lectura/escritura. Las unidades X:, Y: y Z: son solo lectura."
    goto shortcuts
)

REM ===== DATOS =====
whoami /groups | findstr /i "SI-GG-DepDatos" >nul
if not errorlevel 1 (
    net use X: \\altamira.mylocal\Dep-Datos
    net use Y: \\altamira.mylocal\Dep-Gerencia
    net use Z: \\altamira.mylocal\Dep-Informatica
    net use W: \\altamira.mylocal\Dep-Soporte
    msg %username% "Usuario %USERNAME%, la unidad X: es tu carpeta de DATOS con lectura/escritura. Las unidades Y:, W: y Z: son solo lectura."
    goto shortcuts
)

REM ===== INFORMATICA =====
whoami /groups | findstr /i "SI-GG-DepInformatica" >nul
if not errorlevel 1 (
    net use Z: \\altamira.mylocal\Dep-Informatica
    net use X: \\altamira.mylocal\Dep-Datos
    net use Y: \\altamira.mylocal\Dep-Gerencia
    net use W: \\altamira.mylocal\Dep-Soporte
    msg %username% "Usuario %USERNAME%, la unidad Z: es tu carpeta de INFORMATICA con lectura/escritura. Las unidades X:, W: y Y: son solo lectura."
    goto shortcuts
)

REM ===== ACCESOS DIRECTOS (todos los departamentos) =====
:shortcuts
call :CrearAccesoDirecto Y: GERENCIA
call :CrearAccesoDirecto X: DATOS
call :CrearAccesoDirecto Z: INFORMATICA
call :CrearAccesoDirecto W: SOPORTE
pause
exit

REM ===== FUNCIÓN =====
:CrearAccesoDirecto
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut(\"$env:USERPROFILE\Desktop\%2.lnk\"); $Shortcut.TargetPath = '%1\'; $Shortcut.Save()"
goto :eof