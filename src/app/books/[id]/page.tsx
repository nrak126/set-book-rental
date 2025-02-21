"use client"; // クライアントサイドでのみ実行されるように指定

import { useEffect, useState } from "react";

import { Book } from "@/src/types/book";
import axios from "axios";

const BookDetail: React.FC = () => {
  // isbn が取得できるまで処理しないようにする
  const isbn = "9784005008490";
  const [bookInfo, setBookInfo] = useState<Book | null>(null);

  useEffect(() => {
    if (!isbn) return; // isbn が取得できない場合は何も処理しない

    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${isbn}&startIndex=0&maxResults=1&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
        );

        // ISBN-13 の一致確認
        const isMatched = response.data.items.some((item: any) =>
          item.volumeInfo?.industryIdentifiers?.some(
            (identifier: any) =>
              identifier.type === "ISBN_13" && identifier.identifier === isbn
          )
        );

        const volumeInfo = response.data.items[0].volumeInfo;
        const fetchedBook: Book = {
          isbn: isbn as string,
          title: volumeInfo.title || "タイトルが見つかりません",
          author: volumeInfo.authors
            ? volumeInfo.authors.join(", ")
            : "著者情報がありません",
          publisherDate: new Date(volumeInfo.publishedDate || ""),
          description: volumeInfo.description || "説明がありません",
          coverImage: volumeInfo.imageLinks?.thumbnail || "",
          quantity: 1,
          publisher: volumeInfo.publisher || "出版会社情報がありません",
        };
        setBookInfo(fetchedBook);
      } catch (error) {
        console.error("エラー:", error);
        setBookInfo(null); // エラー時にはnullをセット
      }
    };

    fetchBookDetails();
  }, [isbn]); // isbnが変わるたびに再実行

  if (!bookInfo) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h1>{bookInfo.title}</h1>
      <p>著者: {bookInfo.author}</p>
      <p>出版日: {new Date(bookInfo.publisherDate).toLocaleDateString()}</p>
      <p>{bookInfo.description}</p>
      <p>出版社: {bookInfo.publisher}</p>
      <p>在庫数: {bookInfo.quantity}</p>
      <img src={bookInfo.coverImage} alt={bookInfo.title} />
    </div>
  );
};

export default BookDetail;
