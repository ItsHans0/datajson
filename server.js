app.get('/voters', async (req, res) => {
  try {
    const url = 'https://minecraftservers.org/vote/652627';
    const response = await axios.get(url);
    const votersMsg = extractVoters(response.data); // Mengambil hanya daftar nama voters
    res.json({ voters: votersMsg }); // Mengirim daftar nama voters sebagai respons JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voters' });
  }
});

function extractVoters(html) {
  const $ = cheerio.load(html);
  const votersTable = $('table.server-info.voters-info tr');

  if (!votersTable.length) {
    return [];
  }

  const voters = [];
  votersTable.each((index, element) => {
    const voterName = $(element).find('td:eq(0)').text().trim();
    voters.push(voterName); // Menambahkan nama voter ke array voters
  });

  return voters;
}
