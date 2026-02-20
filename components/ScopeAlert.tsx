'use client';

import { useState } from 'react';
import { ScopeAlert as ScopeAlertType } from '@/types';

interface ScopeAlertProps {
  alert: ScopeAlertType;
  meetingTitle?: string;
  onStatusChange?: () => void;
}

export default function ScopeAlert({ alert, meetingTitle, onStatusChange }: ScopeAlertProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (status: 'new' | 'reviewed' | 'billed') => {
    setUpdating(true);
    try {
      const response = await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alert.id, status })
      });

      if (!response.ok) throw new Error('Failed to update status');
      onStatusChange?.();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-red-900">🚨 Scope Creep Detected</h3>
        <select
          value={alert.status}
          onChange={(e) => handleStatusChange(e.target.value as any)}
          disabled={updating}
          className="text-sm rounded px-2 py-1 border border-gray-300"
        >
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="billed">Billed</option>
        </select>
      </div>

      {meetingTitle && (
        <p className="text-sm text-gray-600 mb-2">
          From: <span className="font-medium">{meetingTitle}</span>
        </p>
      )}

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-700">Request:</p>
          <p className="text-sm text-gray-900 bg-white p-2 rounded">
            "{alert.request_text}"
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">Why it's out of scope:</p>
          <p className="text-sm text-gray-900 bg-white p-2 rounded">
            {alert.reason}
          </p>
        </div>

        {alert.contract_reference && (
          <div>
            <p className="text-sm font-medium text-gray-700">Contract reference:</p>
            <p className="text-sm text-gray-900 bg-white p-2 rounded italic">
              {alert.contract_reference}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm font-medium text-blue-900 mb-1">📧 Suggested Response:</p>
        <p className="text-sm text-blue-800">
          "Thanks for bringing this up! I noticed this request ({alert.request_text}) falls outside our current scope. 
          I'd be happy to provide a quote for this as an add-on. Would you like me to send over pricing?"
        </p>
      </div>
    </div>
  );
}
