import tkinter as tk
from tkinter import messagebox
import json
import os
from datetime import datetime

FILE_NAME = "tasks.json"

def load_tasks():
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            return json.load(file)
    return []

def save_tasks(tasks):
    with open(FILE_NAME, "w") as file:
        json.dump(tasks, file, indent=4)

root = tk.Tk()
root.title("📝 To-Do List App with Completion Time")
root.geometry("900x500")
tasks = load_tasks()
for task in tasks:
    if "completed_at" not in task:
        task["completed_at"] = ""
save_tasks(tasks)

entry_frame = tk.Frame(root)
entry_frame.pack(pady=10)

task_entry = tk.Entry(entry_frame, width=40, font=("Arial", 14))
task_entry.grid(row=0, column=0, padx=5)

def add_task():
    task = task_entry.get().strip()
    if task:
        now = datetime.now().strftime("%Y-%m-%d %H:%M")
        tasks.append({
            "task": task,
            "done": False,
            "timestamp": now,
            "completed_at": ""
        })
        save_tasks(tasks)
        update_listbox()
        task_entry.delete(0, tk.END)
    else:
        messagebox.showwarning("Input Error", "Please enter a task.")

add_button = tk.Button(entry_frame, text="Add", command=add_task, width=8)
add_button.grid(row=0, column=1)

header = tk.Label(root, text=f"{'SL':<4} {'Task Title':<35} {'Created At':<20} {'Status':<10} {'Completed At':<20}", 
                  font=("Courier", 11, "bold"), bg="#e0e0e0", anchor="w", justify="left")
header.pack(fill="x", padx=20)

listbox = tk.Listbox(root, width=130, height=15, font=("Courier", 11))
listbox.pack(pady=10)

def update_listbox():
    listbox.delete(0, tk.END)
    for idx, task in enumerate(tasks, 1):
        status = "✓ Done" if task["done"] else "⏳ Pending"
        completed = task.get("completed_at", "") if task["done"] else ""
        display = f"{str(idx):<4} {task['task'][:35]:<35} {task['timestamp']:<20} {status:<10} {completed:<20}"
        listbox.insert(tk.END, display)

update_listbox()

btn_frame = tk.Frame(root)
btn_frame.pack(pady=10)

def mark_done():
    selected = listbox.curselection()
    if selected:
        index = selected[0]
        tasks[index]["done"] = not tasks[index]["done"]
        if tasks[index]["done"]:
            tasks[index]["completed_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        else:
            tasks[index]["completed_at"] = ""
        save_tasks(tasks)
        update_listbox()

def delete_task():
    selected = listbox.curselection()
    if selected:
        index = selected[0]
        tasks.pop(index)
        save_tasks(tasks)
        update_listbox()

done_button = tk.Button(btn_frame, text="✔ Mark Done", command=mark_done)
done_button.grid(row=0, column=0, padx=10)

delete_button = tk.Button(btn_frame, text="🗑 Delete", command=delete_task)
delete_button.grid(row=0, column=1, padx=10)

root.mainloop()
