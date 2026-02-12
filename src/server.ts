import express, { Request, Response } from "express";
import path from "path";
import {
  addBook,
  deleteBook,
  getOneBook,
  readBooks,
} from "./services/bookFileDb";

const app = express();
const PORT = process.env.PORT || 3000;

// TODO 5: Add middleware for HTML form + JSON + static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req: Request, res: Response) => {
  // TODO 6: Send public/index.html
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.get("/books", (req: Request, res: Response) => {
  // TODO 7: Return all books as JSON
  const books = readBooks();
  return res.json(books);
});

app.post("/books/add", (req: Request, res: Response) => {
  try {
    // TODO 8: Read bookName from req.body.bookName and validate (trim it)
    // If empty -> return res.status(400).send("bookName is required");
    const bookName = req.body.bookName.toString().trim();
    if (bookName === "") {
      return res.status(400).send("bookName is required");
    } else {
      addBook(bookName);

      return res.redirect("/");
    }
    // TODO 9: Call addBook(bookName)

    // TODO 10: Redirect to "/" after success
    // Hint: return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});
app.delete("/books/delete/:bookName", (req: Request, res: Response) => {
  try {
    const { bookName } = req.params;
    if (bookName === "") {
      return res.status(400).send("bookName is required");
    } else {
      deleteBook(bookName);

      const books = readBooks();
      return res.json(books);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});
//get one book
app.get("/books/:bookName", (req: Request, res: Response) => {
  try {
    const { bookName } = req.params;

    if (!bookName) {
      return res.status(400).send("bookName is required");
    }

    const book = getOneBook(bookName);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
