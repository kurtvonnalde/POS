import { useState, useRef, useEffect } from "react";
import { Zap, ZapOff } from "lucide-react";
import "./BarcodeScanner.scss";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  enabled?: boolean;
}

export default function BarcodeScanner({ onScan, enabled = false }: BarcodeScannerProps) {
  const [isActive, setIsActive] = useState(enabled);
  const [lastBarcode, setLastBarcode] = useState("");
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [isActive]);

  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const barcode = (e.target as HTMLInputElement).value.trim();
      if (barcode) {
        setLastBarcode(barcode);
        onScan(barcode);
        (e.target as HTMLInputElement).value = "";
        
        // Visual feedback
        (e.target as HTMLInputElement).classList.add("scanned");
        setTimeout(() => {
          (e.target as HTMLInputElement).classList.remove("scanned");
        }, 200);
      }
    }
  };

  const toggleScanner = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="barcode-scanner">
      <button
        className={`scanner-toggle ${isActive ? "active" : ""}`}
        onClick={toggleScanner}
        title={isActive ? "Disable barcode scanner" : "Enable barcode scanner"}
      >
        {isActive ? <Zap size={18} /> : <ZapOff size={18} />}
        <span className="toggle-label">{isActive ? "Scanner ON" : "Scanner OFF"}</span>
      </button>

      {isActive && (
        <div className="scanner-input-group">
          <input
            ref={barcodeInputRef}
            type="text"
            className="barcode-input"
            placeholder="Scan barcode here..."
            onKeyPress={handleBarcodeInput}
            autoComplete="off"
          />
          {lastBarcode && (
            <div className="last-scanned">
              Last: <span className="barcode-value">{lastBarcode}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
