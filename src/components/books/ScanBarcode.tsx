"use client";

import React, { useEffect, useRef, useState } from "react";
import Quagga from "quagga";

export const Barcode: React.FC = () => {
  // カメラ映像を表示するためのRef
  const scannerRef = useRef<HTMLDivElement>(null);

  // スキャンされたバーコードの値を管理するState
  const [isbnCode, setIsbnCode] = useState<string | null>(null);

  useEffect(() => {
    // QuaggaJSの初期化
    Quagga.init(
      {
        inputStream: { type: "LiveStream", target: scannerRef.current },
        decoder: {
          readers: ["ean_reader", "code_128_reader"],
          multiple: false, // 複数のバーコードを同時に読み取らないようにする
        },
        locate: true, // バーコード位置を上げる
        locator: {
          patchSize: "medium", // バーコード位置検出の精度を上げる
          halfSample: true, // 精度向上のための半分のサイズでサンプル
        },
      },
      (err: Error | null) => {
        if (err) {
          console.error("Quaggaエラー:", err);
          return;
        }
        Quagga.start();
      }
    );

    // バーコードが検出されたとき
    Quagga.onDetected((result: any) => {
      const barcode = result.codeResult.code; // スキャンされたバーコード
      if (barcode.startsWith("978") || barcode.startsWith("979")) {
        // ISBNは通常13桁
        setIsbnCode(barcode);
        Quagga.stop(); // スキャンを止める
      } else {
        Quagga.start();
      }
    });
  }, []);

  return (
    <div>
      <div ref={scannerRef} style={{ width: "100%", height: "200px" }} />
      <p
        style={{
          position: "absolute",
          top: "65%",
          fontSize: "18px",
        }}
      >
        スキャン結果: {isbnCode || "スキャン中..."}
      </p>
    </div>
  );
};
