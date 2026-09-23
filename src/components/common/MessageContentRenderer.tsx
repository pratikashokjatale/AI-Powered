import React, { useState } from 'react';
import { Image as ImageIcon, ZoomIn, X, Download } from 'lucide-react';
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
  const [zoomedImage, setZoomedImage] = useState<{ url: string; name: string } | null>(null);

  const handleDownload = (e: React.MouseEvent, url: string, name: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = name || 'chat_attachment.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`message-content-renderer ${isAgent ? 'is-agent-message' : 'is-customer-message'}`}>
      {/* Text Content */}
      {text && <p className="message-text">{text}</p>}

      {/* Render Attached Images */}
      {images.length > 0 && (
        <div className="message-images-gallery">
          {images.map((img, idx) => (
            <div key={idx} className="message-image-card">
              <div
                className="image-thumbnail-wrapper"
                onClick={() => setZoomedImage({ url: img.url, name: img.name })}
                title="Click to view full image"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="chat-embedded-image"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback on broken image
                    (e.target as HTMLImageElement).alt = 'Image could not be loaded';
                  }}
                />
                <div className="image-zoom-overlay">
                  <div className="zoom-action">
                    <ZoomIn size={16} />
                    <span>View</span>
                  </div>
                  <button
                    type="button"
                    className="save-action-btn"
                    onClick={(e) => handleDownload(e, img.url, img.name)}
                    title="Download / Save image"
                  >
                    <Download size={15} />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              <div className="image-card-caption">
                <ImageIcon size={12} className="caption-icon" />
                <span className="caption-text">{img.name}</span>
                <button
                  type="button"
                  className="caption-download-btn"
                  onClick={(e) => handleDownload(e, img.url, img.name)}
                  title="Save image"
                  aria-label="Save image"
                >
                  <Download size={12} />
                </button>
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
            <div className="lightbox-top-bar">
              <button
                type="button"
                className="lightbox-action-btn"
                onClick={(e) => handleDownload(e, zoomedImage.url, zoomedImage.name)}
                title="Download / Save image"
              >
                <Download size={18} />
                <span>Save</span>
              </button>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setZoomedImage(null)}
                aria-label="Close image preview"
              >
                <X size={20} />
              </button>
            </div>
            <img src={zoomedImage.url} alt={zoomedImage.name} className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
};
