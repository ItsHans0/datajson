// index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const data = { data: true };
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
