const href = location.href;
var app =  href.substring(href.lastIndexOf('/'), href.indexOf(".html"));
var path = href.substring(0, href.lastIndexOf('/') + 1);
var api = "https://js.arcgis.com/4.10/";

var loaderConfig = {
  paths: {
    text: `${path}node_modules/text/text`,
    vs: `${path}node_modules/monaco-editor/min/vs`,
    "@types": `${path}node_modules/@types`,
    stepsApplication: `${path}src/stepsApplication`,
    ts: `${path}src/ts`,
    app: `${path}src/${app}`,
    esri: `${api}esri`,
    dojo: `${api}dojo`,
    "@dojo": `${api}@dojo`,
    dojox: `${api}dojox`,
    dijit: `${api}dijit`,
    tslib: `${path}node_modules/tslib/tslib`,
    moment: `${api}moment`,
    maquette: `${path}node_modules/maquette/dist/maquette.umd`,
    "maquette-css-transitions": `${path}node_modules/maquette-css-transitions/dist/maquette-css-transitions.umd`,
    "maquette-jsx": `${path}node_modules/maquette-jsx/dist/maquette-jsx.umd`
  },
  baseUrl: `${api}dojo`
 
}

window.dojoConfig = loaderConfig;
