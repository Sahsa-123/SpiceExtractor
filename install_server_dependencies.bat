@echo off
echo === Python dependencies installation ===

REM activate cirtual surrounding if needed
REM call venv\Scripts\activate

python -m pip install --upgrade pip
python -m pip install -r server\serverRequirements.txt

if %ERRORLEVEL% EQU 0 (
    echo Installation succesfulll
) else (
    echo Error of installation: %ERRORLEVEL%
)

pause
