"use client";
import React, { useState } from "react";
import { Barcode } from "@/src/components/books/ScanBarcode";

const Page: React.FC = () => {
  const [isbn, setIsbn] = useState("");
  return (
    <div>
      {/* BarcodeコンポーネントにsetIsbn関数をプロパティとして渡す */}
      <Barcode setIsbn={setIsbn} />
      {/* ISBNコードを表示 */}
      <p
        style={{
          position: "absolute",
          top: "58%",
          fontSize: "18px",
        }}
      >
        {isbn || "スキャン中..."}
      </p>
    </div>
  );
};
export default Page;
