#!/usr/bin/env python3
import psutil
import time
import sys
import os
from datetime import datetime

def get_cpu_memory():
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    return cpu_percent, memory.percent, memory.used, memory.total

def format_bytes(bytes_value):
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.1f}{unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.1f}PB"

def main():
    try:
        while True:
            cpu, mem_percent, mem_used, mem_total = get_cpu_memory()
            timestamp = datetime.now().strftime("%H:%M:%S")
            
            # Clear screen and show stats
            os.system('clear')
            print(f"╔═══════════════════════════════════════╗")
            print(f"║     System Monitor - {timestamp}     ║")
            print(f"╠═══════════════════════════════════════╣")
            print(f"║ CPU:     {cpu:5.1f}%                   ║")
            print(f"║ Memory:  {mem_percent:5.1f}%                   ║")
            print(f"║ Used:    {format_bytes(mem_used):>10}              ║")
            print(f"║ Total:   {format_bytes(mem_total):>10}              ║")
            print(f"╚═══════════════════════════════════════╝")
            
            # Show top processes
            print("\nTop CPU Processes:")
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
                try:
                    if proc.info['cpu_percent'] > 5:
                        print(f"  {proc.info['name']:<15} {proc.info['cpu_percent']:5.1f}%")
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            
            time.sleep(2)
            
    except KeyboardInterrupt:
        print("\nMonitor stopped.")

if __name__ == "__main__":
    main()
