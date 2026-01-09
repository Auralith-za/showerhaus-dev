import type { ProductFragment } from 'storefrontapi.generated';
import { Image } from '@shopify/hydrogen';
import { useState, useEffect } from 'react';

export function ProductImage({
  image,
  media,
  className,
}: {
  image: ProductFragment['selectedOrFirstAvailableVariant']['image'];
  media?: ProductFragment['media']['nodes'];
  className?: string;
}) {
  const [activeImage, setActiveImage] = useState(image);

  // Update active image if the variant image changes (e.g., user selects a new color)
  useEffect(() => {
    if (image) {
      setActiveImage(image);
    }
  }, [image]);

  if (!activeImage) {
    return <div className={`product-image bg-gray-50 aspect-[4/5] ${className || ''}`} />;
  }

  // Filter only images from media nodes
  const images = media
    ?.map((item) => item.image)
    .filter((img): img is NonNullable<typeof img> => !!img) || [];

  // If no usage content, just fallback to single image
  const galleryImages = images.length > 0 ? images : [activeImage];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
      {galleryImages.length > 1 && (
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 md:h-full no-scrollbar px-1 md:px-0">
          {galleryImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img)}
              className={`flex-shrink-0 w-20 h-20 md:w-full md:h-auto aspect-square border-2 transition-all duration-200 ${activeImage.id === img.id
                  ? 'border-primary opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
                }`}
            >
              <Image
                data={img}
                alt={img.altText || 'Thumbnail'}
                className="w-full h-full object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className={`flex-1 relative bg-gray-50 overflow-hidden ${className || ''}`}>
        <Image
          data={activeImage}
          alt={activeImage.altText || 'Product Image'}
          className="w-full h-full object-cover animate-fade-in"
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </div>
    </div>
  );
}
