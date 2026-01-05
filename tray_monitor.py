#!/usr/bin/env python3
import psutil
import time
import sys
import os
from datetime import datetime
import threading

try:
    import pystray
    from PIL import Image, ImageDraw, ImageFont
    TRAY_AVAILABLE = True
except ImportError:
    TRAY_AVAILABLE = False

def get_cpu_memory():
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()
    return cpu_percent, memory.percent

def create_icon(cpu, memory):
    # Create a simple icon showing CPU and memory
    img = Image.new('RGB', (64, 64), color='black')
    draw = ImageDraw.Draw(img)
    font = ImageFont.load_default()
    
    # CPU bar (top half)
    cpu_height = int(28 * (cpu / 100))
    draw.rectangle([4, 30 - cpu_height, 30, 30], fill='red' if cpu > 80 else 'yellow' if cpu > 50 else 'green')
    
    # Memory bar (bottom half)
    mem_height = int(28 * (memory / 100))
    draw.rectangle([34, 30 - mem_height, 60, 30], fill='red' if memory > 80 else 'yellow' if memory > 50 else 'green')
    
    # Text labels (compact so they fit in the tray)
    cpu_text = f"C{int(cpu):02d}"
    mem_text = f"M{int(memory):02d}"
    draw.text((2, 34), cpu_text, fill='white', font=font)
    draw.text((2, 48), mem_text, fill='white', font=font)

    return img

def monitor_loop(icon):
    while True:
        cpu, memory = get_cpu_memory()
        icon.icon = create_icon(cpu, memory)
        icon.title = f"CPU: {cpu:.1f}% | Memory: {memory:.1f}%"
        time.sleep(2)

def main():
    if TRAY_AVAILABLE:
        # Create system tray icon
        icon = pystray.Icon("system_monitor")
        icon.icon = create_icon(0, 0)
        icon.title = "System Monitor"
        
        # Start monitoring in background thread
        monitor_thread = threading.Thread(target=monitor_loop, args=(icon,), daemon=True)
        monitor_thread.start()
        
        # Run the icon
        icon.run()
    else:
        # Fallback to terminal mode
        print("System tray not available. Running in terminal mode.")
        print("Install with: pip3 install pystray pillow")
        print()
        
        try:
            while True:
                cpu, memory = get_cpu_memory()
                timestamp = datetime.now().strftime("%H:%M:%S")
                
                os.system('clear')
                print(f"╔═══════════════════════════════════════╗")
                print(f"║     System Monitor - {timestamp}     ║")
                print(f"╠═══════════════════════════════════════╣")
                print(f"║ CPU:     {cpu:5.1f}%                   ║")
                print(f"║ Memory:  {memory:5.1f}%                   ║")
                print(f"╚═══════════════════════════════════════╝")
                
                time.sleep(2)
                
        except KeyboardInterrupt:
            print("\nMonitor stopped.")

if __name__ == "__main__":
    main()
