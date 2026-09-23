import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X } from 'lucide-react';
import { parseMessageContent } from '../../utils/imageUtils';

interface MessageContentRendererProps {
  content: string;
  isAgent?: boolean;
}

export const MessageContentRenderer: React.FC<MessageContentRendererProps> = ({
  content,
  isAgent = false,
}) => {
  const { text, images } = parseMessageContent(content);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <div className="message-content-renderer">
      {/* Text Content */}
      {text && <p className="message-text">{text}</p>}

      {/* Render Attached Images */}
      {images.length > 0 && (
        <div className="message-images-gallery">
          {images.map((img, idx) => (
            <div key={idx} className="message-image-card">
              <div
                className="image-thumbnail-wrapper"
                onClick={() => setZoomedImage(img.url)}
                title="Click to view full image"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="chat-embedded-image"
                  loading="lazy"
                />
                <div className="image-zoom-overlay">
                  <ZoomIn size={18} />
                  <span>View</span>
                </div>
              </div>

              <div className="image-card-caption">
                <ImageIcon size={12} className="caption-icon" />
                <span className="caption-text">{img.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zoomed Lightbox Modal */}
      {zoomedImage && (
        <div
          className="image-lightbox-backdrop"
          onClick={() => setZoomedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="image-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setZoomedImage(null)}
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>
            <img src={zoomedImage} alt="Full preview" className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
};
