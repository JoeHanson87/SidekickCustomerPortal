'use client';

import { useEffect, useRef, useState } from 'react';

interface ChangesModalProps {
  productName: string;
  categoryName: string;
  proofId: string;
  userName: string;
  userEmail: string;
  onClose: () => void;
}

export default function ChangesModal({
  productName,
  categoryName,
  proofId,
  userName,
  userEmail,
  onClose,
}: ChangesModalProps) {
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-brand-dark text-lg">Request Changes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition rounded-full p-1 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Request sent!</h3>
            <p className="text-gray-500 text-sm mb-6">
              The Sidekick team will review your changes and get back to you shortly.
            </p>
            <button
              onClick={onClose}
              className="bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Auto-filled product info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Product Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="text-sm font-medium text-gray-800">{categoryName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Product</p>
                  <p className="text-sm font-medium text-gray-800">{productName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Proof Reference</p>
                  <p className="text-sm font-mono text-gray-600">PROOF-{proofId.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  defaultValue={userName}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={userEmail}
                  readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Changes notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Changes required <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Please describe the changes you'd like made to this proof…"
                rows={5}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                Be as specific as possible — font changes, colour adjustments, text updates, etc.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium rounded-lg py-2.5 text-sm transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !notes.trim()}
                className="flex-1 bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold rounded-lg py-2.5 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending…' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
