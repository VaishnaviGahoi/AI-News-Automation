start cmd /k "ollama serve"
timeout /t 3
start cmd /k "python dashboard/app.py"