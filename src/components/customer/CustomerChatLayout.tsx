import React, { useState, useRef, useEffect } from 'react';
import { Send, Package, Sparkles, CheckCircle2, ShieldCheck, RefreshCw, Image, X, Paperclip } from 'lucide-react';
import type { ConversationDto } from '../../types/conversation';
import type { BrandDto } from '../../types/brand';
import { Badge } from '../common/Badge';
import { formatTime, formatDate, formatCurrency } from '../../utils/formatters';
import { MessageContentRenderer } from '../common/MessageContentRenderer';
import { compressImage, SAMPLE_BROKEN_BOTTLE_IMAGE } from '../../utils/imageUtils';

interface CustomerChatLayoutProps {
  conversation: ConversationDto;
  brand: BrandDto;
  onSendMessage: (content: string) => Promise<void>;
  isSending: boolean;
  onRefresh?: () => void;
  onSwitchToAgent?: () => void;
}

export const CustomerChatLayout: React.FC<CustomerChatLayoutProps> = ({
  conversation,
  brand,
  onSendMessage,
  isSending,
  onRefresh,
  onSwitchToAgent,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages, attachedImage]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !attachedImage) || isSending) return;

    let fullContent = inputText.trim();
    if (attachedImage) {
      const cleanName = imageName || 'damaged_bottle_photo.jpg';
      // Cache image in session for immediate persistence
      try {
        sessionStorage.setItem(`photo_${cleanName}`, attachedImage);
      } catch {
        // Ignore quota errors if storage is full
      }

      // Append standard markdown image so both backend and frontend store and display it
      const imageMarkdown = `\n\n![${cleanName}](${attachedImage})`;
      fullContent = fullContent ? `${fullContent}${imageMarkdown}` : `![${cleanName}](${attachedImage})`;
    }

    setInputText('');
    setAttachedImage(null);
    setImageName('');
    await onSendMessage(fullContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      try {
        const compressed = await compressImage(file, 640, 0.75);
        setAttachedImage(compressed);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAttachedImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAttachSampleBrokenBottle = () => {
    const sampleName = 'broken_bottle_photo.jpg';
    setImageName(sampleName);
    setAttachedImage(SAMPLE_BROKEN_BOTTLE_IMAGE);
    if (!inputText) {
      setInputText('Here is the photo of the broken bottle and damaged package as requested.');
    }
  };

  const handlePresetClick = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="customer-view-container">
      {/* Top Customer Info Banner */}
      <div className="customer-testing-banner">
        <div className="banner-left">
          <span className="banner-badge">Customer Portal</span>
          <span className="banner-desc">
            Signed in as <strong>{conversation.customerName}</strong>
          </span>
        </div>

        <div className="banner-actions">
          {onRefresh && (
            <button
              type="button"
              className="banner-action-btn"
              onClick={onRefresh}
              title="Refresh conversation messages"
            >
              <RefreshCw size={13} />
              <span>Refresh Chat</span>
            </button>
          )}
          {onSwitchToAgent && (
            <button
              type="button"
              className="banner-action-btn"
              onClick={onSwitchToAgent}
              title="Switch to Agent Workspace"
            >
              <span>Back to Agent</span>
            </button>
          )}
        </div>
      </div>

      {/* Realistic Customer Chat Phone / Window Container */}
      <div className="customer-chat-wrapper">
        <div className="customer-chat-card">
          {/* Brand Customer Header */}
          <div className="customer-chat-header">
            <div className="brand-header-info">
              <div className="customer-brand-avatar">
                {brand.code.substring(0, 2)}
              </div>
              <div className="brand-text-details">
                <div className="brand-name-row">
                  <h3 className="customer-brand-title">{brand.name} Support</h3>
                  <span className="verified-icon">
                    <ShieldCheck size={14} />
                  </span>
                </div>
                <div className="online-indicator-row">
                  <span className="online-dot"></span>
                  <span className="online-text">Typically replies instantly with AI</span>
                </div>
              </div>
            </div>

            <Badge variant="success" size="sm">
              Live Support
            </Badge>
          </div>

          {/* Customer Order Banner */}
          {conversation.order && (
            <div className="customer-order-banner">
              <div className="order-banner-top">
                <div className="order-banner-id">
                  <Package size={14} className="text-indigo-400" />
                  <span>Order #{conversation.order.orderNumber}</span>
                </div>
                <Badge variant="success" size="sm">
                  {conversation.order.orderStatus}
                </Badge>
              </div>

              <div className="order-banner-details">
                <p className="order-items-text">{conversation.order.itemSummary}</p>
                <div className="order-meta-chips">
                  <span>Delivered: {formatDate(conversation.order.deliveryDate)}</span>
                  <span>•</span>
                  <span>Total: {formatCurrency(conversation.order.totalAmount, conversation.order.currency)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Message Thread */}
          <div className="customer-messages-stream">
            <div className="chat-encryption-notice">
              <span>Messages are encrypted. Support assisted by {brand.name} AI.</span>
            </div>

            {conversation.messages.map((msg) => {
              const isCustomer = msg.senderType === 'CUSTOMER';

              return (
                <div
                  key={msg.id}
                  className={`cust-message-row ${isCustomer ? 'cust-own-message' : 'cust-agent-message'}`}
                >
                  {!isCustomer && (
                    <div className="brand-mini-avatar" title={brand.name}>
                      <Sparkles size={12} />
                    </div>
                  )}

                  <div className="cust-bubble-wrapper">
                    <div className={`cust-bubble ${isCustomer ? 'cust-bubble-right' : 'cust-bubble-left'}`}>
                      <MessageContentRenderer content={msg.content} isAgent={!isCustomer} />
                    </div>

                    <div className="cust-msg-meta">
                      <span className="cust-msg-time">{formatTime(msg.createdAt)}</span>
                      {isCustomer && <CheckCircle2 size={11} className="cust-delivered-check" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Quick Prompts for Testing */}
          <div className="customer-presets-drawer">
            <span className="presets-heading">Quick Inquiries:</span>
            <div className="presets-chips-row">
              <button
                type="button"
                className="cust-preset-chip"
                onClick={() =>
                  handlePresetClick('My order was delivered but the bottle is broken. What can I do?')
                }
              >
                🧴 "Broken bottle delivered"
              </button>

              <button
                type="button"
                className="cust-preset-chip"
                onClick={handleAttachSampleBrokenBottle}
                title="Quickly attach sample photo of broken bottle as requested by support"
              >
                📸 "Attach Broken Bottle Photo"
              </button>

              <button
                type="button"
                className="cust-preset-chip"
                onClick={() =>
                  handlePresetClick('I received this 20 days ago. Can I get a refund?')
                }
              >
                ⏳ "Received 20 days ago (Guardrail test)"
              </button>

              <button
                type="button"
                className="cust-preset-chip"
                onClick={() =>
                  handlePresetClick('How do I return my order and get an RMA number?')
                }
              >
                📦 "Return & RMA inquiry"
              </button>
            </div>
          </div>

          {/* Image Attachment Preview Bar */}
          {attachedImage && (
            <div className="customer-image-preview-bar">
              <div className="preview-image-container">
                <img src={attachedImage} alt="Attachment preview" className="preview-thumb" />
                <div className="preview-meta">
                  <span className="preview-name">{imageName || 'Attached Photo'}</span>
                  <span className="preview-status">Ready to send</span>
                </div>
              </div>
              <button
                type="button"
                className="preview-remove-btn"
                onClick={() => {
                  setAttachedImage(null);
                  setImageName('');
                }}
                aria-label="Remove attached photo"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Customer Input Box with Image Attachment Button */}
          <form onSubmit={handleSend} className="customer-input-area">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Add Image Button */}
            <button
              type="button"
              className={`customer-attach-btn ${attachedImage ? 'has-attachment' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              title="Add Image / Photo of damaged item"
              aria-label="Attach photo"
            >
              <Image size={18} />
            </button>

            {/* Sample Photo Quick Button */}
            <button
              type="button"
              className="customer-attach-btn"
              onClick={handleAttachSampleBrokenBottle}
              title="Quick sample: Attach broken bottle photo"
              aria-label="Attach sample photo"
            >
              <Paperclip size={18} />
            </button>

            <textarea
              className="customer-textarea"
              placeholder={`Message ${brand.name} support...`}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              type="submit"
              className="customer-send-btn"
              disabled={(!inputText.trim() && !attachedImage) || isSending}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
