async function renderBooks(books) {
  const el = document.getElementById("book-list");
  // It's cleaner to handle the mapping in a helper function
  el.innerHTML = books
    .map((b) => `<div>${b.bookNo}. ${b.bookName}</div>`)
    .join("");
}

async function loadBooks() {
  try {
    const res = await fetch("/books");
    const books = await res.json();
    renderBooks(books);
  } catch (err) {
    console.error("Failed to load books:", err);
  }
}

async function deleteBook() {
  const input = document.getElementById("bookName");
  const bookName = input.value.trim();

  if (!bookName) return alert("Please enter a book name to delete");

  try {
    // Recommendation: Use DELETE method instead of GET
    const res = await fetch(`/books/delete/${encodeURIComponent(bookName)}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const books = await res.json();
      renderBooks(books);
      input.value = ""; // Clear input after successful delete
    } else {
      alert("Book not found or server error");
    }
  } catch (err) {
    console.error("Delete failed:", err);
  }
}
async function searchBook() {
  const input = document.getElementById("bookName");
  const bookName = input.value.trim();
  if (!bookName) return alert("Please enter a book name to delete");

  try {
    const res = await fetch(`/books/${encodeURIComponent(bookName)}`);

    if (res.ok) {
      const books = await res.json();
      renderBooks(books);
      input.value = ""; // Clear input after successful delete
    } else {
      alert("Book not found or server error");
    }
  } catch (err) {
    console.error("Delete failed:", err);
  }
}

document.getElementById("deleteBtn").addEventListener("click", deleteBook);
document.getElementById("searchBtn").addEventListener("click", searchBook);
window.addEventListener("DOMContentLoaded", loadBooks);
