'use client';

import { useState } from 'react';
import { getAllStyles } from '@/lib/beer/styles';
import type { Beer } from '@/lib/beer/types';

type ManualEntryFormProps = {
  onSubmit: (beer: Beer) => void;
  onCancel: () => void;
};

export default function ManualEntryForm({ onSubmit, onCancel }: ManualEntryFormProps) {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('');
  const [abv, setAbv] = useState('');
  const [ibu, setIbu] = useState('');
  const [styleError, setStyleError] = useState(false);

  const styles = getAllStyles();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!style) {
      setStyleError(true);
      return;
    }

    const beer: Beer = {
      id: `manual-${Date.now()}`,
      name: name.trim() || 'Custom Beer',
      style,
      abv: abv ? parseFloat(abv) : null,
      ibu: ibu ? parseInt(ibu, 10) : null,
      description: `Manually entered ${style}`,
      brewery: 'Unknown',
      imageUrl: null,
      source: 'manual',
    };

    onSubmit(beer);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Enter Beer Details
      </h2>
      <p className="text-sm text-gray-600">
        Can&apos;t find your beer? Enter the details manually.
      </p>

      <div>
        <label htmlFor="beer-name" className="mb-1 block text-sm font-medium text-gray-700">
          Beer Name <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="beer-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My Local Brew"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label htmlFor="beer-style" className="mb-1 block text-sm font-medium text-gray-700">
          Style <span className="text-red-500">*</span>
        </label>
        <select
          id="beer-style"
          value={style}
          onChange={(e) => {
            setStyle(e.target.value);
            setStyleError(false);
          }}
          className={`w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
            styleError
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-300 focus:border-amber-500'
          }`}
        >
          <option value="">Select a style...</option>
          {styles.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        {styleError && (
          <p className="mt-1 text-sm text-red-600">Please select a beer style.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="beer-abv" className="mb-1 block text-sm font-medium text-gray-700">
            ABV % <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="beer-abv"
            type="number"
            step="0.1"
            min="0"
            max="30"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
            placeholder="e.g. 5.5"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label htmlFor="beer-ibu" className="mb-1 block text-sm font-medium text-gray-700">
            IBU <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="beer-ibu"
            type="number"
            min="0"
            max="200"
            value={ibu}
            onChange={(e) => setIbu(e.target.value)}
            placeholder="e.g. 45"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      >
        View Beer Info
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="block w-full text-center text-sm text-amber-600 hover:text-amber-700 hover:underline"
      >
        Back to search
      </button>
    </form>
  );
}
