@echo off
echo Running lead engine tests...
cd %~dp0
python scripts\lead_engine\test_all.py
echo.
echo.
echo Running dashboard tests...
python scripts\lead_engine\test_dashboard.py
pause