import json
import os
from datetime import datetime

BOOKS_FILE = "books.json"
RECORDS_FILE = "library.json"

def load_data(file):
    if os.path.exists(file):
        with open(file, "r") as f:
            return json.load(f)
    return []

def save_data(file, data):
    with open(file, "w") as f:
        json.dump(data, f, indent=2)

# 1. Add Book
def add_book():
    title = input("Book Title: ").strip()
    author = input("Author Name: ").strip()
    isbn = input("ISBN (optional): ").strip()

    try:
        quantity = int(input("Quantity: "))
    except ValueError:
        print(" Invalid quantity.")
        return

    books = load_data(BOOKS_FILE)

    # Check if the book already exists by title
    for book in books:
        if book["title"].lower() == title.lower():
            # Add quantity to existing book
            if "quantity" not in book:
                book["quantity"] = 0
            book["quantity"] += quantity
            save_data(BOOKS_FILE, books)
            print(f" Updated quantity. Now {book['quantity']} copies of '{title}' available.")
            return

    # If new book, add it to the list
    new_book = {
        "title": title,
        "author": author,
        "isbn": isbn,
        "quantity": quantity
    }
    books.append(new_book)
    save_data(BOOKS_FILE, books)
    print(" New book added.")


# 2. View Books
def view_books():
    books = load_data(BOOKS_FILE)
    if not books:
        print(" No books in the catalog.")
        return

    print("\n Available Books:")
    for i, book in enumerate(books, 1):
        print(f"{i}. {book['title']} by {book['author']} | ISBN: {book.get('isbn', '-')}, Quantity: {book['quantity']}")

# 3. Search Book
def search_book():
    keyword = input("Search title/author: ").strip().lower()
    books = load_data(BOOKS_FILE)
    found = [b for b in books if keyword in b["title"].lower() or keyword in b["author"].lower()]
    if not found:
        print(" No books found.")
    else:
        print("\n Search Results:")
        for i, b in enumerate(found, 1):
            print(f"{i}. {b['title']} by {b['author']} | Quantity: {b['quantity']}")

# 4. Issue Book
def issue_book():
    student = input("Student Name: ").strip()
    book_title = input("Book Title to Issue: ").strip()
    time = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    books = load_data(BOOKS_FILE)
    records = load_data(RECORDS_FILE)

    for book in books:
        if book["title"].lower() == book_title.lower():
            if book["quantity"] > 0:
                book["quantity"] -= 1
                records.append({
                    "student": student,
                    "book": book_title,
                    "issued_at": time,
                    "status": "Issued"
                })
                save_data(BOOKS_FILE,books)
                save_data(RECORDS_FILE,records)
                print(f" Book '{book_title}' issued to {student}.")
            else:
                print(" Book not available (0 quantity).")
            return
    print(" Book not found.")

# 5. Return Book
def return_book():
    student = input("Student Name: ").strip()
    book_title = input("Book Title to Return: ").strip()
    time = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    records = load_data(RECORDS_FILE)
    books = load_data(BOOKS_FILE)

    for record in records:
        if (record["student"].lower() == student.lower() and
            record["book"].lower() == book_title.lower() and
            record["status"] == "Issued"):
            record["status"] = "Returned"
            record["returned_at"] = time

            # Increase quantity
            for book in books:
                if book["title"].lower() == book_title.lower():
                    book["quantity"] += 1
                    break

            save_data(BOOKS_FILE,books)
            save_data(RECORDS_FILE,records)
            print(f" Book '{book_title}' returned by {student}.")
            return

    print(" Issued record not found.")

# 6. View All Transactions
def view_transactions():
    records = load_data(RECORDS_FILE)
    if not records:
        print(" No transactions found.")
        return

    print("\n Transactions:")
    print("Name |","BookName |","Status |","Date |")
    for i, r in enumerate(records, 1):
        line = f"{i}. {r['student']} | {r['book']} | {r['status']} | Issued: {r['issued_at']}"
        if r["status"] == "Returned":
            line += f" | Returned: {r.get('returned_at', '-')}"
        print(line)

# === CLI Menu ===
while True:
    print("\n== 📖 Library System ==")
    print("1. Add Book")
    print("2. View All Books")
    print("3. Search Book")
    print("4. Issue Book")
    print("5. Return Book")
    print("6. View All Transactions")
    print("7. Exit")
    choice = input("Enter your choice: ")

    if choice == "1":
        add_book()
    elif choice == "2":
        view_books()
    elif choice == "3":
        search_book()
    elif choice == "4":
        issue_book()
    elif choice == "5":
        return_book()
    elif choice == "6":
        view_transactions()
    elif choice == "7":
        break
    else:
        print("❌ Invalid choice. Try again.")
