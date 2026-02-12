import fs from "fs";
import path from "path";

export type Book = {
  bookNo: number;
  bookName: string;
};

type DbShape = { books: Book[] };

const dbPath = path.join(process.cwd(), "data", "books.json");

// TODO 1: Implement readDb(): DbShape
// - If file not found: create data folder + books.json with { books: [] }
// - Read file text (utf-8) and JSON.parse
function readDb(): DbShape {
  // TODO 1

  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    const initialData: DbShape = { books: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  const fileContent = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(fileContent) as DbShape;
}

// TODO 2: Implement writeDb(db: DbShape)
// - JSON.stringify(db, null, 2) and writeFileSync utf-8
function writeDb(db: DbShape) {
  // TODO 2
  const content = JSON.stringify(db, null, 2);
  fs.writeFileSync(dbPath, content, "utf-8");
}

export function readBooks(): Book[] {
  // TODO 3: return readDb().books
  return readDb().books; // TODO 3
}

export function addBook(bookName: string): Book {
  // TODO 4:
  // - read db
  // - find max bookNo
  // - create newBook { bookNo: max+1, bookName }
  // - push, write db
  // - return newBook
  const db = readDb();

  // Find max bookNo (default to 0 if list is empty)
  const maxNo = db.books.reduce(
    (max, book) => (book.bookNo > max ? book.bookNo : max),
    0,
  );

  const newBook: Book = {
    bookNo: maxNo + 1,
    bookName,
  };
  console.log(bookName);

  db.books.push(newBook);
  writeDb(db);

  return newBook;

  // return { bookNo: 0, bookName }; // TODO 4
}
//delete
export function deleteBook(bookName: string): Book[] {
  const db = readDb();

  // Filter out the book with the matching name
  // We use .trim() and .toLowerCase() to make the search more "human-friendly"
  const initialLength = db.books.length;

  db.books = db.books.filter(
    (book) =>
      book.bookName.toLowerCase().trim() !== bookName.toLowerCase().trim(),
  );

  // Only write to the DB if something was actually removed
  if (db.books.length < initialLength) {
    writeDb(db);
  } else {
    // You could throw an error here if you want the API to return a 404
    throw new Error("Book not found");
  }

  return db.books;
}
//search
export function getOneBook(bookName: string): Book[] {
  const db = readDb();

  // Filter returns an array of all matches (could be empty [])
  return db.books.filter(
    (b) => b.bookName.toLowerCase().trim() === bookName.toLowerCase().trim(),
  );
}
