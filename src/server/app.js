const express = require('express');
const compression = require('compression');

const publicweb = process.env.PUBLICWEB || './';
const app = express();
app.use(compression()) //compressing dist folder 

app.use(express.static(publicweb));
console.log(`serving ${publicweb}`);
app.get('*', (req, res) => {
  res.sendFile(`index.html`, { root: publicweb });
});

const port = process.env.PORT || '3000';
app.listen(port, () => console.log(`API running on localhost:${port}`));
