@echo off
set FILE1=server\project\db0.db
set FILE2=server\project\optimize\databases\213342_second.db

if exist "%FILE1%" (
    del "%FILE1%"
    echo %FILE1% was removed
) else (
    echo %FILE1% doesn't exist
)

if exist "%FILE2%" (
    del "%FILE2%"
    echo %FILE2% was removed
) else (
    echo %FILE2% doesn't exist
)
