"use client";
import { Book } from "@/src/types/book"; // Book 型をインポート
import React, { useEffect, useState } from "react";
import { Barcode } from "@/src/components/books/ScanBarcode"; // Barcode コンポーネント
import axios from "axios";

const Page: React.FC = () => {
  const [isbn, setIsbn] = useState<string>(""); // ISBN
  const [bookInfo, setBookInfo] = useState<Book | null>(null); // Book 型で本のすべての情報を管理する状態

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${isbn}&startIndex=0&maxResults=1&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
        );
        if (response.data.items && response.data.items.length > 0) {
          const volumeInfo = response.data.items[0].volumeInfo;
          const fetchedBook: Book = {
            isbn: isbn, // ISBN
            title: volumeInfo.title || "タイトルが見つかりません",
            author: volumeInfo.authors
              ? volumeInfo.authors.join(", ") //著者が複数いる場合カンマ区切り
              : "著者情報がありません",
            publisherDate: new Date(volumeInfo.publishedDate || ""), // 日付のフォーマットを合わせる
            description: volumeInfo.description || "説明がありません",
            coverImage: volumeInfo.imageLinks?.thumbnail || "", // 画像URL
            quantity: 1, // 数量のデフォルト値（必要なら変更）
            publisher: volumeInfo.publisher || "出版会社情報がありません",
          };
          setBookInfo(fetchedBook); // 本の情報をまとめて状態にセット
        } else {
          setBookInfo({
            isbn: "",
            title: "タイトルが見つかりません",
            author: "著者情報がありません",
            publisherDate: new Date(),
            description: "説明がありません",
            coverImage: "",
            quantity: 0,
            publisher: "出版会社情報がありません",
          });
        }
      } catch (error) {
        console.error("エラー:", error);
        setBookInfo(null); // エラーが発生した場合、nullにセット
      }
    };

    if (isbn) {
      fetchBookData();
    }
  }, [isbn]);

  return (
    <div>
      {/* ISBNが空ならBarcodeコンポーネントを表示 */}
      {!isbn ? (
        <Barcode setIsbn={setIsbn} />
      ) : (
        // ISBNがある場合は本の情報を表示
        <>
          {bookInfo ? (
            <>
              <p>名前: {bookInfo.title}</p>
              <p>著者: {bookInfo.author}</p>
              <p>出版日: {bookInfo.publisherDate.toLocaleDateString()}</p>
              <p>isbn: {isbn}</p>
              <p>説明: {bookInfo.description}</p>
              <p>出版社: {bookInfo.publisher}</p>
              {bookInfo.coverImage && bookInfo.coverImage !== "" && (
                <img
                  src={bookInfo.coverImage}
                  alt="Book Cover"
                  style={{ maxWidth: "200px" }}
                />
              )}
            </>
          ) : (
            <p>本の情報が見つかりませんでした。</p>
          )}
        </>
      )}
    </div>
  );
};

export default Page;
