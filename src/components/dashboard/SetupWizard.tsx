'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SetupWizardProps {
  onDismiss: () => void;
}

export function SetupWizard({ onDismiss }: SetupWizardProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if wizard has been dismissed
    const dismissed = localStorage.getItem('beer_glass_wizard_dismissed');
    if (dismissed) {
      setShow(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('beer_glass_wizard_dismissed', 'true');
    setShow(false);
    onDismiss();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
      <h2 className="mb-3 text-xl font-bold text-gray-900">
        Welcome to Beer Glass App!
      </h2>
      <p className="mb-4 text-gray-700">
        Let's get started by adding your glass collection. This helps your guests find the perfect glass for their beer.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/dashboard/glasses"
          className="inline-block rounded bg-amber-600 px-4 py-2 text-center font-medium text-white hover:bg-amber-700"
        >
          Add My First Glasses
        </Link>
        <button
          onClick={handleDismiss}
          className="text-amber-700 underline hover:text-amber-800"
        >
          I'll do this later
        </button>
      </div>
    </div>
  );
}
