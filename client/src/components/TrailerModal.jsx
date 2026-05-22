import { useEffect } from 'react';

export default function TrailerModal({ trailerKey, onClose }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click outside (backdrop) to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl animate-scale-in">
        {/* Close button */}
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white text-sm font-semibold flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            ✕ Close
          </button>
        </div>

        {/* Video container */}
        <div className="aspect-video w-full ring-1 ring-white/10 rounded-xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
