'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contract_text: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create project');

      const { project } = await response.json();
      router.push(`/dashboard/projects/${project.id}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="contract_text" className="block text-sm font-medium text-gray-700">
          Contract / SOW Text
        </label>
        <textarea
          id="contract_text"
          required
          rows={10}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          value={formData.contract_text}
          onChange={(e) => setFormData({ ...formData, contract_text: e.target.value })}
          placeholder="Paste your contract or scope of work here..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating & Analyzing...' : 'Create Project'}
      </button>
    </form>
  );
}
