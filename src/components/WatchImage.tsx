import React, { useState } from 'react';

interface WatchImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  eager?: boolean;
}

export const WatchImage: React.FC<WatchImageProps> = ({
  src,
  alt,
  title,
  className = '',
  eager = false,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#181B22] via-[#12141A] to-[#0B0C10] text-center p-6 ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className="text-[#D4AF37]/60 mb-3"
        >
          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.45" />
          <path d="M24 16V24L29 27" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M20 4H28M20 44H28" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
        <span className="font-serif text-sm text-[#F4F0E8]/80">{title ?? alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      fetchPriority={eager ? 'high' : 'auto'}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
