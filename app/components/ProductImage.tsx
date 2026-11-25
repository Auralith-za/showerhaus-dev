import type { ProductFragment } from 'storefrontapi.generated';
import { Image } from '@shopify/hydrogen';
import { useState, useEffect, useRef } from 'react';
import { getImageKey, isSameImage, type ImageLike } from '~/lib/variantGallerySync';

export function ProductImage({
  image,
  media,
  className,
  onImageSelect,
}: {
  image: ProductFragment['selectedOrFirstAvailableVariant']['image'] | ImageLike | null | undefined;
  media?: ProductFragment['media']['nodes'];
  className?: string;
  onImageSelect?: (selectedImg: ImageLike) => void;
}) {
  // Filter only images from media nodes
  const images =
    media
      ?.map((item: any) => item?.image)
      .filter((img): img is NonNullable<typeof img> => Boolean(img)) || [];

  // Resolve a passed variant image to its matching media node image if present so IDs & keys stay consistent
  const resolveToGalleryImage = (targetImg?: ImageLike | null) => {
    if (!targetImg) return images[0] || null;
    const matchedInGallery = images.find((gImg) => isSameImage(gImg, targetImg));
    return matchedInGallery || targetImg;
  };

  const [activeImage, setActiveImage] = useState<ImageLike | null>(() =>
    resolveToGalleryImage(image),
  );

  const touchStartXRef = useRef<number | null>(null);

  // Update active image whenever the parent's selected variant image changes (e.g. clicking a Finish/Color swatch)
  useEffect(() => {
    if (image) {
      const resolved = resolveToGalleryImage(image);
      if (resolved) {
        setActiveImage(resolved);
      }
    }
  }, [getImageKey(image)]);

  if (!activeImage) {
    return <div className={`product-image bg-gray-50 aspect-square ${className || ''}`} />;
  }

  const galleryImages: ImageLike[] = images.length > 0 ? images : [activeImage];

  const handleUserSelectImage = (img: ImageLike) => {
    setActiveImage(img);
    if (onImageSelect) {
      onImageSelect(img);
    }
  };

  const currentIndex = galleryImages.findIndex((gImg) =>
    isSameImage(gImg, activeImage),
  );

  const handleStepImage = (delta: number) => {
    if (galleryImages.length <= 1) return;
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex =
      (safeIndex + delta + galleryImages.length) % galleryImages.length;
    handleUserSelectImage(galleryImages[nextIndex]);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
      {galleryImages.length > 1 && (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 md:h-full no-scrollbar px-1 md:px-0">
          {galleryImages.map((img, idx) => {
            const isSelected = isSameImage(activeImage, img);
            return (
              <button
                key={img.id || getImageKey(img) || idx}
                type="button"
                onClick={() => handleUserSelectImage(img)}
                aria-label={img.altText || `View product image ${idx + 1}`}
                aria-current={isSelected ? 'true' : undefined}
                className={`flex-shrink-0 w-20 h-20 md:w-full md:h-auto aspect-square border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-primary opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  data={img as any}
                  alt={img.altText || 'Thumbnail'}
                  className="w-full h-full object-cover"
                  sizes="100px"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Image (Supports Touch Swipe on Mobile) */}
      <div
        className={`flex-1 relative bg-gray-50 overflow-hidden select-none ${className || ''}`}
        onTouchStart={(e) => {
          touchStartXRef.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartXRef.current === null || galleryImages.length <= 1) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
          const diff = touchStartXRef.current - endX;
          touchStartXRef.current = null;
          if (Math.abs(diff) > 40) {
            handleStepImage(diff > 0 ? 1 : -1);
          }
        }}
      >
        <Image
          key={getImageKey(activeImage)}
          data={activeImage as any}
          alt={activeImage.altText || 'Product Image'}
          className="w-full h-full object-cover animate-fade-in"
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </div>
    </div>
  );
}
