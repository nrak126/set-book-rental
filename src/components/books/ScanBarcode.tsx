"use client";

import React, { useEffect, useRef } from "react";
import Quagga from "quagga";

type BarcodeProps = {
  setIsbn: (isbn: string) => void;
};

export const Barcode: React.FC<BarcodeProps> = ({ setIsbn }) => {
  // カメラ映像を表示するためのRef
  const scannerRef = useRef<HTMLDivElement>(null);

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
        setIsbn(barcode);
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
          top: "58%",
          fontSize: "18px",
        }}
      >
        スキャン中...
      </p>
    </div>
  );
};
