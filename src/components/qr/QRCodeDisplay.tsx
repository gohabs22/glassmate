'use client';

import { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toBlob } from 'html-to-image';

type QRCodeDisplayProps = {
  userId: string;
};

export function QRCodeDisplay({ userId }: QRCodeDisplayProps) {
  const [checkInUrl, setCheckInUrl] = useState('');
  const [canShare, setCanShare] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Build check-in URL from current origin
    const url = `${window.location.origin}/c/${userId}`;
    setCheckInUrl(url);

    // Detect Web Share API with file support
    if (typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator) {
      // Check if we can share files
      const testFile = new File([''], 'test.png', { type: 'image/png' });
      try {
        setCanShare(navigator.canShare!({ files: [testFile] }));
      } catch {
        setCanShare(false);
      }
    }
  }, [userId]);

  const handleCopyUrl = async () => {
    if (!checkInUrl) return;
    try {
      await navigator.clipboard.writeText(checkInUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownload = async () => {
    if (!qrContainerRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await toBlob(qrContainerRef.current);
      if (!blob) {
        throw new Error('Failed to generate image');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'my-collection-qr.png';
      link.href = url;
      link.click();

      // Clean up to prevent memory leaks
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download QR code:', err);
      alert('Failed to download QR code. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!qrContainerRef.current || isSharing) return;

    setIsSharing(true);
    try {
      const blob = await toBlob(qrContainerRef.current);
      if (!blob) {
        throw new Error('Failed to generate image');
      }

      const file = new File([blob], 'my-collection-qr.png', {
        type: 'image/png',
      });

      await navigator.share({
        files: [file],
        title: 'My Beer Glass Collection',
        text: 'Scan this QR code to see my beer glass collection!',
      });
    } catch (err: any) {
      // User cancelled share dialog
      if (err.name === 'AbortError') {
        // Silent fail - user intentionally cancelled
        return;
      }

      // Other errors - fall back to download
      console.error('Failed to share QR code:', err);
      await handleDownload();
    } finally {
      setIsSharing(false);
    }
  };

  if (!checkInUrl) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR Code with white background for quiet zone */}
      <div
        ref={qrContainerRef}
        className="inline-block rounded-lg bg-white p-4 shadow-md"
        style={{ padding: '16px' }}
      >
        <QRCode
          value={checkInUrl}
          size={256}
          level="M"
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      {/* Check-in URL with copy button */}
      <div className="flex w-full max-w-md flex-col items-center gap-2">
        <p className="text-center text-sm font-medium text-gray-700">
          Check-in URL:
        </p>
        <div className="flex w-full items-center gap-2">
          <input
            type="text"
            value={checkInUrl}
            readOnly
            className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
          />
          <button
            onClick={handleCopyUrl}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 rounded-md bg-amber-600 px-6 py-3 font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isDownloading ? 'Downloading...' : 'Download QR Code'}
        </button>

        {canShare && (
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 rounded-md bg-amber-600 px-6 py-3 font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSharing ? 'Sharing...' : 'Share QR Code'}
          </button>
        )}
      </div>
    </div>
  );
}
