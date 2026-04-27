import { readCodexSampleOutput, codexEpisodeJsonSchema } from './episodeContract.js';

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5.2-codex';
const DEFAULT_REASONING_EFFORT = 'low';

const providerFromEnv = () => {
  const provider = (process.env.CODEX_DRAFT_PROVIDER || 'auto').trim().toLowerCase();
  if (provider !== 'auto') return provider;
  return process.env.OPENAI_API_KEY ? 'openai' : 'sample';
};

const extractResponseText = (response) => {
  if (typeof response.output_text === 'string') return response.output_text;

  const texts = response.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter((text) => typeof text === 'string');

  return texts?.join('\n') ?? '';
};

const parseJsonOutput = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('OpenAI response did not contain JSON output.');
    return JSON.parse(match[0]);
  }
};

const buildOpenAIInput = (prompt) => [
  {
    role: 'system',
    content: [
      {
        type: 'input_text',
        text: [
          'You are Codex, acting as a local personal AI radio planner.',
          'Generate one concise episode plan from the supplied local context.',
          'Return JSON that exactly matches the provided schema.',
        ].join(' '),
      },
    ],
  },
  {
    role: 'user',
    content: [
      {
        type: 'input_text',
        text: JSON.stringify(prompt),
      },
    ],
  },
];

const generateWithOpenAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is required when CODEX_DRAFT_PROVIDER=openai.');

  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const reasoningEffort = process.env.OPENAI_REASONING_EFFORT || DEFAULT_REASONING_EFFORT;
  const maxOutputTokens = Number(process.env.OPENAI_MAX_OUTPUT_TOKENS || 1800);

  const response = await fetch(process.env.OPENAI_RESPONSES_URL || OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: buildOpenAIInput(prompt),
      reasoning: {
        effort: reasoningEffort,
      },
      max_output_tokens: maxOutputTokens,
      text: {
        format: {
          type: 'json_schema',
          name: 'codex_episode_plan',
          strict: true,
          schema: codexEpisodeJsonSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI Responses API returned ${response.status}: ${detail.slice(0, 400)}`);
  }

  return {
    provider: 'openai',
    source: 'openai-responses',
    model,
    output: parseJsonOutput(extractResponseText(await response.json())),
  };
};

const generateWithSample = async () => ({
  provider: 'sample',
  source: 'sample-output',
  model: null,
  output: await readCodexSampleOutput(),
});

export const generateCodexEpisodePlan = async (prompt) => {
  const provider = providerFromEnv();

  if (provider === 'openai') return generateWithOpenAI(prompt);
  if (provider === 'sample') return generateWithSample();

  throw new Error(`Unsupported CODEX_DRAFT_PROVIDER: ${provider}`);
};
