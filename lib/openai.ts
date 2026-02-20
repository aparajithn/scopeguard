import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  const openai = getOpenAIClient();
  // Convert Buffer to Uint8Array for Blob compatibility
  const uint8Array = new Uint8Array(audioBuffer);
  const blob = new Blob([uint8Array], { type: 'audio/mpeg' });
  const file = new File([blob], 'audio.mp3', { type: 'audio/mpeg' });
  
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
  });

  return transcription.text;
}

export async function extractScope(contractText: string) {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant that extracts scope information from contracts and SOWs.
Analyze the contract and return a JSON object with:
- deliverables: Array of specific deliverables mentioned
- exclusions: Array of explicitly excluded items
- constraints: Array of limitations (timeline, budget, revisions, etc.)

Be precise and extract only what's explicitly stated.`
      },
      {
        role: 'user',
        content: contractText
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  return content ? JSON.parse(content) : { deliverables: [], exclusions: [], constraints: [] };
}

export async function analyzeMeeting(transcript: string, scopeSummary: any) {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an AI assistant that detects scope creep in meeting transcripts.

Given a project scope and a meeting transcript, identify any requests or discussions that fall outside the defined scope.

Return a JSON array of alerts, where each alert has:
- request_text: The specific request or topic discussed
- reason: Why it's out of scope
- contract_reference: Which part of the scope it conflicts with

Only flag clear scope violations. Don't be overly sensitive.`
      },
      {
        role: 'user',
        content: `Project Scope:\n${JSON.stringify(scopeSummary, null, 2)}\n\nMeeting Transcript:\n${transcript}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  const result = content ? JSON.parse(content) : { alerts: [] };
  return result.alerts || [];
}
