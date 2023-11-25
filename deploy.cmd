echo %SITE_FLAVOR%
@echo off
IF "%SITE_FLAVOR%" == "SP" (
	echo run cutom for site_falvor: %SITE_FLAVOR%....
    deploy.custom.cmd
) 

IF "%SITE_FLAVOR%" == "OWC" (
	echo run other for site_falvor: %SITE_FLAVOR%....
    deploy.other.cmd
)