import os
import subprocess
import sys
import time
import webbrowser

ASCII_ART = r"""
     ██╗ ██████╗ ███████╗██╗   ██╗███╗   ██╗
     ██║██╔═══██╗██╔════╝╚██╗ ██╔╝████╗  ██║
     ██║██║   ██║█████╗   ╚████╔╝ ██╔██╗ ██║
██   ██║██║   ██║██╔══╝    ╚██╔╝  ██║╚██╗██║
╚█████╔╝╚██████╔╝██║        ██║   ██║ ╚████║
 ╚════╝  ╚═════╝ ╚═╝        ╚═╝   ╚═╝  ╚═══╝
"""

def print_centered_ascii():
    try:
        # ANSI purple color
        purple = "\033[95m"
        reset = "\033[0m"
        terminal_width = os.get_terminal_size().columns
        
        print("\n" * 2)
        for line in ASCII_ART.splitlines():
            if line.strip():
                centered_line = line.center(terminal_width)
                print(f"{purple}{centered_line}{reset}")
        
        print("\n")
        print(f"{purple}{'JOFYN - Auto Scout Engine'.center(terminal_width)}{reset}")
        print(f"{purple}{'v1.0.0 beta'.center(terminal_width)}{reset}")
        print("\n")
        print(f"{'JOFYN is ready to help you find your dream job.'.center(terminal_width)}")
        print(f"{'Status: Online'.center(terminal_width)}")
        print("\n")
    except Exception as e:
        print(f"Welcome to JOFYN v1.0.0 beta")

def install_dependencies():
    # Silently install dependencies
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"], 
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        if not os.path.exists('node_modules'):
            subprocess.check_call(["npm", "install"], shell=True, 
                                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        print(f"[!] Error installing dependencies: {e}")

def run_backend():
    # Run Flask with reduced logging if possible, but user wants logs
    return subprocess.Popen([sys.executable, "backend/main.py"])

def run_frontend():
    # Run Vite silently to keep terminal clean
    return subprocess.Popen(["npm", "run", "dev"], shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    os.system('cls' if os.name == 'nt' else 'clear')
    print("[SYSTEM] Checking requirements... Please wait.")
    install_dependencies()
    
    os.system('cls' if os.name == 'nt' else 'clear')
    print_centered_ascii()
    
    try:
        backend_proc = run_backend()
        frontend_proc = run_frontend()
        
        terminal_width = os.get_terminal_size().columns
        print(f"{'➜  Frontend: http://localhost:5173'.center(terminal_width)}")
        print(f"{'➜  Backend:  http://localhost:5000'.center(terminal_width)}")
        print(f"{'━' * terminal_width}")
        print(f"{'LOGS / ACTIVITY'.center(terminal_width)}")
        print(f"{'━' * terminal_width}")
        
        # Wait a bit for servers to be ready
        time.sleep(3)
        webbrowser.open('http://localhost:5173')
        
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None or frontend_proc.poll() is not None:
                break
            
    except KeyboardInterrupt:
        print("\n[SYSTEM] Stopping JOFYN...")
        backend_proc.terminate()
        frontend_proc.terminate()
        sys.exit(0)
    except Exception as e:
        print(f"[ERROR] {str(e)}")

if __name__ == "__main__":
    main()
