import type { Photo } from '../data/photos';

/* Blur-up photograph, stateless: the tiny LQIP renders as a real image
   UNDER the full-res one. The browser paints the main image progressively
   over it as it decodes — no onLoad races, no state, nothing to wedge. */
export default function Pic({
  photo,
  alt,
  className,
  eager = false,
  objectPosition,
}: {
  photo: Photo;
  alt: string;
  className?: string;
  eager?: boolean;
  objectPosition?: string;
}) {
  return (
    <div className={`pic ${className ?? ''}`}>
      <img className="pic__lqip" src={photo.lqip} alt="" aria-hidden="true" style={{ objectPosition }} />
      <img
        className="pic__full"
        src={photo.src}
        alt={alt}
        width={photo.w}
        height={photo.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        // @ts-expect-error react types lag fetchpriority
        fetchpriority={eager ? 'high' : undefined}
        style={{ objectPosition }}
      />
    </div>
  );
}
