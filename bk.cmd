@echo off
setlocal enabledelayedexpansion
set x=%date%
set d=!x!
set c=!d:~4,100!
set fl=!c:~0,1!


if /i !fl! equ 0 (set m=!c:~1,1!) else (set m=!c:~0,2!)

set y=!c:~6,4!

set site=%1

if /i NOT DEFINED site (for %%* in (.) do @set site=%%~n*)


set dfold=O:\Cloud\Dropbox\!m!_!y!
set gfold=O:\Cloud\GoogleDrive\!m!_!y!

for /f "usebackq tokens=1,2 delims=^\" %%i in (`whoami`) do set comp=%%j

if /i !comp!==daniel (
	call set gdrive_cloud=C:\Users\Public\Google Drive\www\bk
) else (
	@echo Loading...
	@net use * /delete /Y > nul
	@net use o: \\ele_l2\o$ i29ab_Stract04 /user:daniel > nul
	@call set gdrive_cloud=C:\Users\Public\Daniel_\Google Drive\www\bk
)

del "!gdrive_cloud!\!site!_old.7z" 2>nul



for %%i in ("%gdrive_cloud%\*.*") do set fi=%%~ni & set b=%%i && set c=!b:~0,-1! && set j=!fi: =! && set j=!j!_old.7z && set k=!j: =! &&  rename "!c!" !k!


@set destination=!gdrive_cloud!\!site!.7z

rem rmdir /s /q !dfold!\!site! 2>nul
rem rmdir /s /q !gfold!\!site! 2>nul

mkdir !gfold!\!site! 2>nul
mkdir !dfold!\!site! 2>nul

for %%i in (!gfold!\!site!\*) do set a=!site! && set b=%%i && set c=!a!_!random!.7z && set d=!c: =! &&  rename "%%i" !d!

for %%i in (!dfold!\!site!\*) do set a=!site! && set b=%%i && set c=!a!_!random!.7z && set d=!c: =! && rename "%%i" !d!

@echo Compressing...

@7z a "!destination!" > nul

@set drop=!dfold!\!site!
@set drop=!drop: =!
@set goog=!gfold!\!site!
@set goog=!goog: =!

@echo Copying...

sleep 1


@copy "!destination!" "!goog!" > nul
@copy "!destination!" "!drop!" > nul

@echo Complete^!

endlocal 
exit /b