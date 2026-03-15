@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM === Config ===
set "VPS_USER=root"
set "VPS_HOST=68.183.166.13"
set "SSH_PORT=22"
set "REMOTE_PATH=/root/arkd/backend/"

REM This script assumes your backend folder is at: <repo>\backend
REM and that WSL is installed with rsync + ssh available.

REM Resolve the directory of this .bat (repo root)
set "REPO_DIR=%~dp0"

REM Convert Windows path (e.g. D:\...\frontend\) -> WSL path (/mnt/d/.../frontend/)
set "WIN_DRIVE=%REPO_DIR:~0,1%"
for /f %%i in ('powershell -NoProfile -Command "\"%WIN_DRIVE%\".ToLower()"') do set "WSL_DRIVE=%%i"
set "WIN_PATH_NO_DRIVE=%REPO_DIR:~2%"
set "WIN_PATH_NO_DRIVE=!WIN_PATH_NO_DRIVE:\=/!"
set "WSL_REPO_DIR=/mnt/!WSL_DRIVE!!WIN_PATH_NO_DRIVE!"

if "!WSL_REPO_DIR!"=="" (
  echo.
  echo ERROR: Failed to resolve WSL path for repo dir: %REPO_DIR%
  exit /b 1
)

set "WSL_SRC=!WSL_REPO_DIR!backend/"

echo Deploying backend via WSL rsync...
echo   Local:  !WSL_SRC!
echo   Remote: %VPS_USER%@%VPS_HOST%:%REMOTE_PATH%
echo.

REM IMPORTANT: Keep this as a single line; CMD line breaks will corrupt the bash string.
wsl.exe bash -lc "set -euo pipefail; rsync -avz --exclude='.env' --exclude='node_modules/' --exclude='.git/' --exclude='logs/' --exclude='*.log' --exclude='tmp/' --exclude='.DS_Store' -e 'ssh -p %SSH_PORT%' '!WSL_SRC!' '%VPS_USER%@%VPS_HOST%:%REMOTE_PATH%'"

if errorlevel 1 (
  echo.
  echo ERROR: rsync failed.
  exit /b 1
)

echo.
echo Running remote install + restart...

wsl.exe bash -lc "set -euo pipefail; ssh -p %SSH_PORT% %VPS_USER%@%VPS_HOST% 'cd %REMOTE_PATH% && npm i && pm2 restart 0'"

if errorlevel 1 (
  echo.
  echo ERROR: Remote post-deploy commands failed.
  exit /b 1
)

echo.
echo Done.
echo.

endlocal
