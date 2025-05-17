@echo off
set FILE=server\db0.db

if exist "%FILE%" (
    del "%FILE%"
    echo %FILE% was removed
) else (
    echo %FILE% doesn't exist
)
