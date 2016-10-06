const http = require('http');
const connect = require('connect');
const compression = require('compression');
const serve = require('serve-static');

const safeString = require('safe-string');
const StyletronLegacy = require('styletron-legacy');
const StyletronServer = require('styletron-server');
const StyletronServerLegacy = require('styletron-server-legacy');
const {createElement} = require('react');
const {renderToString} = require('react-dom/server');
const {StyletronProvider} = require('styletron-react');
const App = require('./app');

const server = connect();
server.use(compression());
server.use(serve('static', {index: false}));

const getMarkup = (bodyContent, cssContent, legacyCss, hydrationSrc) =>
`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Styletron React Demo</title>
<link rel="icon" href="data:;base64,iVBORw0KGgo=">
<style data-styletron>${legacyCss}</style>
${cssContent}
</head>
<body>
<div id="app">${bodyContent}</div>
<script>${hydrationSrc}</script>
<script src="/bundle.js"></script>
</body>
</html>`;

server.use((req, res) => {
  const styletron = new StyletronServer();
  const app = createElement(StyletronProvider, {styletron}, createElement(App, {
    path: req.url
  }));
  const {html, css, injectedKeys} = StyletronServerLegacy.renderStatic(() => {
    return renderToString(app);
  });
  
  const modernCss = styletron.getStylesheetsHtml();
  const hydrationSrc = generateHydrationScriptSrc(injectedKeys);

  res.end(getMarkup(html, modernCss, css, hydrationSrc));
});

http.createServer(server).listen(3000, () => {
  console.log('Server listening on: http://localhost:3000');
});

function generateHydrationScriptSrc(keys) {
  var sanitizedKeys = safeString(JSON.stringify(keys));
  return [
    ';try{',
      '(function(){',
        'window["', StyletronLegacy.constants.HYDRATE_KEY, '"]=', sanitizedKeys, ';',
      '})();',
    '}catch(e){};',
  ].join('');
}
