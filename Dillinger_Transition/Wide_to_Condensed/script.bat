@echo off

title Generate fonts
for /r %%i in (*.ttf) do msdf-bmfont -i ../charset.txt -f json -r 16 -s 158 -m [512,512] --pot --smart-size %%i 
pause