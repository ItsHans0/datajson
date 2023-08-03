const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000; // Ganti dengan port yang diinginkan

app.use(express.json());

app.get('/serverInfo', async (req, res) => {
  try {
    const url = 'https://minecraftservers.org/server/652627';
    const response = await axios.get(url);
    const serverInfo = extractServerInfo(response.data);
    res.json(serverInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch server info' });
  }
});

app.get('/voters', async (req, res) => {
  try {
    const url = 'https://minecraftservers.org/vote/652627';
    const response = await axios.get(url);
    const voters = extractVoters(response.data);
    res.json({ voters });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voters' });
  }
});

function extractServerInfo(html) {
  const $ = cheerio.load(html);
  const serverInfo = {};

  serverInfo.owner = $('table.server-info tr:eq(0) td:eq(1) span').text().trim();
  serverInfo.status = $('table.server-info tr:eq(1) td:eq(1) span.tag').text().trim();
  serverInfo.ip = $('table.server-info tr:eq(2) td:eq(1) span').text().trim();
  serverInfo.website = $('table.server-info tr:eq(3) td:eq(1) span a').attr('href').trim();
  serverInfo.players = $('table.server-info tr:eq(4) td:eq(1) span').text().trim();
  serverInfo.version = $('table.server-info tr:eq(5) td:eq(1) a').text().trim();
  serverInfo.rank = $('table.server-info tr:eq(6) td:eq(1) span').text().trim();
  serverInfo.votes = $('table.server-info tr:eq(7) td:eq(1) span').text().trim();
  serverInfo.uptime = $('table.server-info tr:eq(8) td:eq(1) span').text().trim();
  serverInfo.lastPing = $('table.server-info tr:eq(9) td:eq(1) span').text().trim();
  serverInfo.country = $('table.server-info tr:eq(10) td:eq(1) span').text().trim();
  serverInfo.tags = $('table.server-info tr:eq(11) td:eq(1) a').toArray().map((el) => $(el).text().trim());

  return serverInfo;
}

function formatServerInfo(serverInfo) {
  return `> Status: *${serverInfo.status}*
> IP: *${serverInfo.ip}*
> Players: *${serverInfo.players}*
> Version: *${serverInfo.version}*
> Last Ping: *${serverInfo.lastPing}*`;
}

function extractVoters(html) {
  const $ = cheerio.load(html);
  const votersTable = $('table.server-info.voters-info tr');

  if (!votersTable.length) {
    return '';
  }

  let votersMsg = '';
  votersTable.each((index, element) => {
    const voterName = $(element).find('td:eq(0)').text().trim();
    const votes = $(element).find('td:eq(1)').text().trim();
    votersMsg += `• ${voterName}: ${votes}\n`;
  });

  return votersMsg;
}


app.listen(port, () => {
  console.log(`Server API berjalan di http://localhost:${port}`);
});
