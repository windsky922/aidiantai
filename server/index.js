import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readContext } from './context.js';

const PORT = Number(process.env.API_PORT || 8787);
const HOST = process.env.API_HOST || '127.0.0.1';
const pilotEpisodeUrl = new URL('../src/data/pilotEpisode.json', import.meta.url);

const sendJson = (response, statusCode, data) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
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

const server = createServer(async (request, response) => {
  if (!request.url) {
    sendNotFound(response);
    return;
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.end();
    return;
  }

  if (request.method !== 'GET') {
    sendJson(response, 405, {
      error: 'Method not allowed',
    });
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host || `${HOST}:${PORT}`}`);

  try {
    if (url.pathname === '/api/health') {
      sendJson(response, 200, {
        ok: true,
        service: 'codex-ai-radio-api',
      });
      return;
    }

    if (url.pathname === '/api/episodes/pilot') {
      sendJson(response, 200, await readPilotEpisode());
      return;
    }

    if (url.pathname === '/api/context') {
      sendJson(response, 200, await readContext());
      return;
    }

    if (url.pathname === '/api/context/summary') {
      const context = await readContext();
      sendJson(response, 200, context.summary);
      return;
    }

    sendNotFound(response);
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`API server listening on http://${HOST}:${PORT}`);
});
