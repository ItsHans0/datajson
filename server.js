const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

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

function extractVoters(html) {
  const $ = cheerio.load(html);
  const votersTable = $('table.server-info.voters-info tr');

  if (!votersTable.length) {
    return [];
  }

  const voters = [];
  votersTable.each((index, element) => {
    const voterName = $(element).find('td:eq(0)').text().trim();
    voters.push(voterName);
  });

  return voters;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
