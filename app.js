const express = require('express'),
      compression = require('compression'),
      http    = require('http'),
      path    = require('path');

const app = express();

var prerender = require('prerender-node').set('prerenderToken', 'cGB8aefpM1xWi65hWbkR');

prerender.crawlerUserAgents.push("dotbot");
prerender.crawlerUserAgents.push("googlebot");
prerender.crawlerUserAgents.push("rogerbot");
prerender.crawlerUserAgents.push("bingbot");
prerender.crawlerUserAgents.push("yahoobot");
prerender.crawlerUserAgents.push("msnbot");
prerender.crawlerUserAgents.push("slurp");
prerender.crawlerUserAgents.push("facebot");
prerender.crawlerUserAgents.push("duckduckbot");
prerender.crawlerUserAgents.push('yandex');
prerender.crawlerUserAgents.push('WhatsApp') ;
prerender.crawlerUserAgents.push('SkypeUriPreview');
prerender.crawlerUserAgents.push('twitterbot') ;
prerender.crawlerUserAgents.push('Adidxbot') ;

prerender.set('protocol', 'https');
prerender.set('forwardHeaders', true);

app.use(prerender);

app.use(compression());
app.use(express.static(path.join(__dirname, './')));

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

const port = process.env.PORT || '4200';
app.set('port', port);

const server = http.createServer(app);
server.listen(port,() => console.log('Running at port '+port));