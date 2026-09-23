import React, { useState, useEffect } from 'react';
import { ScrollText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import type { InteractionLogDto } from '../../types/ai';
import { aiReplyApi } from '../../api/aiReplyApi';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatTime, formatDate } from '../../utils/formatters';

interface InteractionLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractionLogsModal: React.FC<InteractionLogsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [logs, setLogs] = useState<InteractionLogDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      aiReplyApi
        .getInteractionLogs()
        .then((data) => setLogs(data))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Interaction & Audit Logs"
      subtitle="Full audit trail: customer inquiry, retrieved brand knowledge, original AI output, agent edits, and timestamps."
      maxWidth="xl"
    >
      <div className="audit-logs-container">
        {loading ? (
          <div className="logs-loading">
            <p>Loading interaction logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="logs-empty">
            <ScrollText size={36} className="text-gray-500" />
            <h4>No interactions logged yet</h4>
            <p>Generate an AI reply and click "Approve & Send" to create the first audit record.</p>
          </div>
        ) : (
          <div className="logs-timeline">
            {logs.map((log) => (
              <div key={log.id} className="log-entry-card">
                <div className="log-entry-header">
                  <div className="log-id-meta">
                    <span className="log-id-tag">Audit #{log.id}</span>
                    <span className="log-time-tag">
                      <Clock size={12} />
                      {formatDate(log.createdAt)} {formatTime(log.createdAt)}
                    </span>
                  </div>

                  <div className="log-status-meta">
                    {log.wasEdited ? (
                      <Badge variant="warning" size="sm">
                        Agent Edited
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Sent Unedited
                      </Badge>
                    )}

                    {log.guardrailTriggered ? (
                      <Badge variant="danger" size="sm">
                        <AlertTriangle size={11} />
                        <span>Guardrail Alert</span>
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        <CheckCircle size={11} />
                        <span>Compliant</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="log-field-section">
                  <span className="log-field-label">Customer Message:</span>
                  <div className="log-quote-box">{log.customerMessage}</div>
                </div>

                <div className="log-field-section">
                  <span className="log-field-label">Retrieved Policy Context:</span>
                  <div className="log-context-box">{log.retrievedContext}</div>
                </div>

                <div className="log-diff-grid">
                  <div className="log-diff-col">
                    <span className="log-field-label">Original AI Suggestion:</span>
                    <pre className="log-text-pre">{log.aiGeneratedResponse}</pre>
                  </div>

                  <div className="log-diff-col">
                    <span className="log-field-label">Final Sent Message:</span>
                    <pre className="log-text-pre sent-final">{log.finalResponse}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
