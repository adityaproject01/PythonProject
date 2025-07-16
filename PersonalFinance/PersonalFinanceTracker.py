

import csv
from collections import defaultdict
from tabulate import tabulate
from datetime import datetime

FILENAME = "expenses.csv"

def add_expense():
    item = input("Item name: ")
    category = input("Category (food, travel, etc.): ")
    amount = float(input("Amount (₹): "))
    date = datetime.now().strftime("%Y-%m-%d")

    with open(FILENAME, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([date, item, category, amount])

    print(" Expense added.")

def show_summary():
    records = []
    category_totals = defaultdict(float)
    grand_total = 0
    all_expenses = []

    try:
        with open(FILENAME, "r") as file:
            reader = csv.reader(file)
            for i, row in enumerate(reader, 1):
                if row:
                    date, item, category, amount = row
                    amount = float(amount)
                    grand_total += amount
                    category_totals[category] += amount
                    all_expenses.append({
                        "index": i,
                        "category": category,
                        "item": item,
                        "amount": amount,
                        "date": date
                    })

        if not all_expenses:
            print("⚠️ No expenses to show.")
            return

        # Find highest and lowest
        highest = max(all_expenses, key=lambda x: x["amount"])
        lowest = min(all_expenses, key=lambda x: x["amount"])
        
        # Build final table
        for exp in all_expenses:
            is_highest = highest["amount"] if exp == highest else ""
            is_lowest = lowest["amount"] if exp == lowest else ""
            records.append([
                exp["index"],
                exp["category"],
                exp["item"],
                f"₹{exp['amount']:.2f}",
                exp["date"],
                is_highest,
                is_lowest
            ])

        #  Add Grand Total to last row
        records.append(["", "", " Total", f"₹{grand_total:.2f}", "", "", ""])

        # Show table
        print("\n📊 Expense Summary:\n")
        print(tabulate(records, headers=["SL No", "Category", "Item", "Amount", "Date", "Highest", "Lowest"], tablefmt="grid"))



    except FileNotFoundError:
        print("⚠️ No expense records found. Please add expenses first.")

# === CLI Menu ===
while True:
    print("\n== Personal Finance Tracker ==")
    print("1. Add Expense\n2. Show Summary\n3. Exit")
    choice = input("Enter choice: ")

    if choice == "1":
        add_expense()
    elif choice == "2":
        show_summary()
    elif choice == "3":
        break
    else:
        print("❌ Invalid choice. Try again.")
