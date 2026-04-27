import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readContext } from './context.js';
import { buildCodexDraft } from './codexDraft.js';
import { buildCodexPrompt, buildCodexPromptSummary } from './codexPrompt.js';
import { buildEpisodePreview, codexEpisodeSchema, readCodexSampleOutput } from './episodeContract.js';

const PORT = Number(process.env.API_PORT || 8787);
const HOST = process.env.API_HOST || '127.0.0.1';
const pilotEpisodeUrl = new URL('../src/data/pilotEpisode.json', import.meta.url);
const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const sendJson = (response, statusCode, data) => {
  response.writeHead(statusCode, jsonHeaders);
  response.end(JSON.stringify(data, null, 2));
};

const sendNotFound = (response) => {
  sendJson(response, 404, {
    error: 'Not found',
  });
};

const readPilotEpisode = async () => {
  const content = await readFile(pilotEpisodeUrl, 'utf8');
  return JSON.parse(content);
};

const getRoutes = {
  '/api/health': async () => ({
    ok: true,
    service: 'codex-ai-radio-api',
  }),
  '/api/episodes/pilot': readPilotEpisode,
  '/api/context': readContext,
  '/api/context/summary': async () => {
    const context = await readContext();
    return context.summary;
  },
  '/api/codex/prompt': buildCodexPrompt,
  '/api/codex/prompt/summary': buildCodexPromptSummary,
  '/api/codex/schema': async () => codexEpisodeSchema,
  '/api/codex/sample-output': readCodexSampleOutput,
  '/api/codex/episode-preview': async () => buildEpisodePreview(await readCodexSampleOutput()),
};

const postRoutes = {
  '/api/codex/draft': buildCodexDraft,
};

const server = createServer(async (request, response) => {
  if (!request.url) {
    sendNotFound(response);
    return;
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, jsonHeaders);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);

  try {
    const routes = request.method === 'GET' ? getRoutes : request.method === 'POST' ? postRoutes : null;
    if (!routes) {
      sendJson(response, 405, {
        error: 'Method not allowed',
      });
      return;
    }

    const handler = routes[url.pathname];
    if (!handler) return sendNotFound(response);
    sendJson(response, 200, await handler());
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`API server listening on http://${HOST}:${PORT}`);
});
