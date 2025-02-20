"use client";
import React, { useEffect, useState } from "react";
import { Barcode } from "@/src/components/books/ScanBarcode";
import axios from "axios";

const Page: React.FC = () => {
  const [isbn, setIsbn] = useState("");
  const [bookTitle, setBookTitle] = useState<string>("");
  const [bookCover, setBookCover] = useState<string>("");

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
        );
        if (response.data.items && response.data.items.length > 0) {
          const volumeInfo = response.data.items[0].volumeInfo;
          setBookTitle(volumeInfo.title);
          // 画像が存在する場合、thumbnailまたはsmallThumbnailを使用
          if (volumeInfo.imageLinks) {
            setBookCover(
              volumeInfo.imageLinks.thumbnail ||
                volumeInfo.imageLinks.smallThumbnail ||
                ""
            );
          } else {
            setBookCover("");
          }
        } else {
          setBookTitle("タイトルが見つかりません");
          setBookCover("");
        }
      } catch (error) {
        console.error("エラー:", error);
        setBookTitle("データ取得エラー");
        setBookCover("");
      }
    };

    if (isbn) {
      fetchBookData();
    }
  }, [isbn]);

  return (
    <div>
      {/* ISBNが空ならBarcodeコンポーネント（カメラ）を表示 */}
      {!isbn ? (
        <Barcode setIsbn={setIsbn} />
      ) : (
        // ISBNがある場合は本の情報を表示
        <>
          <p>名前: {bookTitle}</p>
          <p>ISBN: {isbn}</p>
          {bookCover && (
            <img
              src={bookCover}
              alt="Book Cover"
              style={{ maxWidth: "200px" }}
            />
          )}
        </>
      )}
    </div>
  );
};
export default Page;
