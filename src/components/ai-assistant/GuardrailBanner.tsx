import React from 'react';
import { AlertTriangle, ShieldAlert, AlertCircle, CheckCircle } from 'lucide-react';
import type { GuardrailStatus } from '../../types/ai';

interface GuardrailBannerProps {
  status: GuardrailStatus;
  notes: string;
  triggered: boolean;
}

export const GuardrailBanner: React.FC<GuardrailBannerProps> = ({ status, notes, triggered }) => {
  if (!triggered && status === 'PASSED') {
    return (
      <div className="guardrail-banner guardrail-passed">
        <div className="guardrail-icon">
          <CheckCircle size={16} />
        </div>
        <div className="guardrail-text">
          <strong>Guardrail Status: Grounded & Compliant</strong>
          <p>{notes || 'AI output verified against active brand policy.'}</p>
        </div>
      </div>
    );
  }

  let Icon = AlertTriangle;
  let bannerClass = 'guardrail-warning';
  let title = 'Policy Guardrail Triggered';

  if (status === 'POLICY_VIOLATION' || status === 'RESTRICTED_ACTION') {
    Icon = ShieldAlert;
    bannerClass = 'guardrail-danger';
    title = 'Policy Boundary Alert (Restricted Action)';
  } else if (status === 'NO_POLICY_FOUND') {
    Icon = AlertCircle;
    bannerClass = 'guardrail-warning';
    title = 'Knowledge Gap Alert (No Policy Found)';
  }

  return (
    <div className={`guardrail-banner ${bannerClass}`}>
      <div className="guardrail-icon">
        <Icon size={18} />
      </div>
      <div className="guardrail-text">
        <div className="guardrail-title-row">
          <strong>{title}</strong>
          <span className="guardrail-badge-code">{status}</span>
        </div>
        <p className="guardrail-desc">{notes}</p>
        <span className="guardrail-guidance">
          Human verification required: Please check before approving or send a manual reply.
        </span>
      </div>
    </div>
  );
};
