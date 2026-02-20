'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface MeetingUploadProps {
  projectId: string;
}

export default function MeetingUpload({ projectId }: MeetingUploadProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState<'text' | 'audio'>('text');
  const [formData, setFormData] = useState({
    title: '',
    transcript: ''
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('project_id', projectId);
      data.append('title', formData.title);

      if (uploadType === 'text') {
        data.append('transcript', formData.transcript);
      } else if (audioFile) {
        data.append('audio', audioFile);
      }

      const response = await fetch('/api/meetings', {
        method: 'POST',
        body: data
      });

      if (!response.ok) throw new Error('Failed to upload meeting');

      const { meeting } = await response.json();
      router.push(`/dashboard/projects/${projectId}?meeting=${meeting.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Failed to upload meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Meeting Title
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Client Kickoff Call"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="uploadType"
              value="text"
              checked={uploadType === 'text'}
              onChange={() => setUploadType('text')}
              className="mr-2"
            />
            Text Transcript
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="uploadType"
              value="audio"
              checked={uploadType === 'audio'}
              onChange={() => setUploadType('audio')}
              className="mr-2"
            />
            Audio File
          </label>
        </div>
      </div>

      {uploadType === 'text' ? (
        <div>
          <label htmlFor="transcript" className="block text-sm font-medium text-gray-700">
            Transcript
          </label>
          <textarea
            id="transcript"
            required
            rows={10}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={formData.transcript}
            onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
            placeholder="Paste meeting transcript here..."
          />
        </div>
      ) : (
        <div>
          <label htmlFor="audio" className="block text-sm font-medium text-gray-700">
            Audio File
          </label>
          <input
            type="file"
            id="audio"
            accept="audio/*"
            required
            className="mt-1 block w-full"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          />
          <p className="mt-1 text-sm text-gray-500">
            Supported formats: MP3, WAV, M4A (max 25MB)
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Upload & Analyze Meeting'}
      </button>
    </form>
  );
}
