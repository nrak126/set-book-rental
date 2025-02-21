"use client";
import { useEffect, useState } from "react";
import type { Book } from "@/src/types/book";

import { useRouter } from "next/navigation";

export default function Page() {
  const [books, setBooks] = useState<Book[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/books");
      const data = await response.json();
      setBooks(data);
    })();
  }, []);

  return (
    <>
      <h1>本のリスト</h1>
      <ul>
        {books.map((book) => (
          <li key={book.isbn}>
            <h3>{book.title} </h3>
            <p>{book.author}</p>
            {/* Next.js の Link コンポーネントを使って、詳細ページに遷移 */}
            <button
              onClick={() => {
                router.push(`/books/${book.isbn}`);
              }}
            >
              詳細GO
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
