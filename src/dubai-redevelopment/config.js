define([
    "esri/WebScene",
    "esri/views/SceneView",
    "esri/core/watchUtils",
    "esri/config",
    "esri/core/urlUtils"
  ],
  function (
    WebScene,
    SceneView,
    watchUtils,
    esriConfig,
    urlUtils
  ) {
    let webscene, view, buildingsLayer, projectLayer;

    const websceneId = "3712088239a8484a82a46d0e5dde7fde";

    return {
      title: "Dubai Redevelopment",

      setup: function () {

        // esriConfig.request.proxyUrl = "/resource-proxy-latest/PHP/proxy.php";

        // Proxy the route requests to avoid prompt for log in
        urlUtils.addProxyRule({
          urlPrefix: "www.arcgis.com",
          proxyUrl: "/resource-proxy-latest/PHP/proxy.php"
        });

        webscene = new WebScene({
          portalItem: {
            id: websceneId
          }
        });

        view = new SceneView({
          map: webscene,
          container: "viewDiv",
          padding: {
            top: 70,
            right: 500
          },
          ui: {
            padding: {
              right: 150
            }
          },
          qualityProfile: "high",
          
        });

        window.view = view;

        view.when(function () {

          view.goTo({
            "position": {
              "spatialReference": {
                "latestWkid": 3857,
                "wkid": 102100
              },
              "x":6150052.438877768,"y":2898076.017758344,"z":470.1571760857478
            },
            'tilt': 81.76971540564205, 'heading': 56.11800491361131
          });

            watchUtils.watch(view, "interacting", function(r) {
              const c = view.camera.clone();
              console.log('camera', "position: " + JSON.stringify(c.position) + ", 'tilt:' " + c.tilt + ", 'heading:' " + c.heading );
            });

          projectLayer = webscene.layers.filter(function (layer) {
            return layer.title === "Project";
          }).getItemAt(0);

          buildingsLayer = webscene.layers.filter(function (layer) {
            return layer.title === "Buildings";
          }).getItemAt(0);

          contextLayer = webscene.layers.filter(function (layer) {
            return layer.title === "Context";
          }).getItemAt(0);
        })

        view.ui.empty("top-left");
      },

      steps: [

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 0: Add Scene Layer
        //
        /////////////////////////////////////////////////////////////////////////////////
//         {
//         title: "Add 3D content",
//         code: `
// const buildingsLayer = new SceneLayer({ 
//   portalItem: { id: "73df987984b24094b848d580eb83b0fb" }
// });
//         `,
//           before: function(){}
//         },

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 1: Change symbology
        //
        /////////////////////////////////////////////////////////////////////////////////
        {
          title: "Change existing building style",
          code: `
  buildingsLayer.renderer = {
    type: 'simple',
    symbol: {
      type: 'mesh-3d',
      symbolLayers: [{
        type: 'fill',
        material: {
          color: '#efe7d0'
        }
      }]
    }
  };
          `,
          before: function(){
            //view.map.presentation.slides.getItemAt(1).applyTo(view);
          },
          run:function(){
            const colorRend = renderer = {
              type: 'simple',
              symbol: {
                type: 'mesh-3d',
                symbolLayers: [{
                  type: 'fill',
                  material: {
                    color: '#efe7d0'
                  }
                }]
              }
            };
            buildingsLayer.renderer = colorRend;
            contextLayer.renderer = colorRend;
          }

        },
       
        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 2: Add project layer
        //
        /////////////////////////////////////////////////////////////////////////////////

  //       {
  //
  //         title: "Add project layer",
  //
  //         code: `
  // const projectLayer = new SceneLayer({
  //   url: "https://.../ProjectBuilding/SceneServer"
  // });
  // view.map.add(projectLayer);
  //         `,
  //         before: function () {
  //           view.map.presentation.slides.getItemAt(2).applyTo(view);
  //         },
  //
  //         run: function () {
  //           view.map.presentation.slides.getItemAt(3).applyTo(view);
  //         }
  //       },

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 3: Enable 'Edge Rendering'
        //
        /////////////////////////////////////////////////////////////////////////////////

        {
          title: "Enable Edge Rendering",

          code: `
  const renderer = projectLayer.renderer.clone();
  const fillSymbolLayer = renderer.symbol.symbolLayers.getItemAt(0);

  fillSymbolLayer.edges = {
    type: 'solid',
    color: "#383838",
    size: 0.5
  };

  projectLayer.renderer = renderer;
  buildingsLayer.renderer = renderer;
          `,
          before: function () {
            view.map.presentation.slides.getItemAt(4).applyTo(view);
            view.goTo({
              "position": {
                "spatialReference": {
                  "latestWkid": 3857,
                  "wkid": 102100
                },
                "x":6153592.044898389,"y":2904552.4062726134,"z":91.21633680537343
              },
              "heading": 35.76854420508165,
              "tilt": 67.98540272393139
            })
          },

          run: function () {
            const renderer = projectLayer.renderer.clone();
            const fillSymbolLayer = renderer.symbol.symbolLayers.getItemAt(0);

            fillSymbolLayer.edges = {
              type: 'solid',
              color: [56,56,56,0.7],
              size: 0.5,
              extensionLength: 0
            };

            projectLayer.renderer = renderer;

            const renderer2 = buildingsLayer.renderer.clone();
            const fillSymbolLayer2 = renderer2.symbol.symbolLayers.getItemAt(0);

            fillSymbolLayer2.edges = {
              type: 'solid',
              color: [56,56,56,0.5],              
              size: 0.5,
              extensionLength: 0
            };
            
            buildingsLayer.renderer = renderer2;
            contextLayer.renderer = renderer2;
          }
        },

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 4: Emphasize the planned project
        //
        /////////////////////////////////////////////////////////////////////////////////

        {
          title: "Emphasize the planned project",

          code: `
  const renderer = projectLayer.renderer.clone();
  const fillSymbolLayer = renderer.symbol.symbolLayers.getItemAt(0);

  fillSymbolLayer.edges = {
    type: 'sketch',
    color: "#534026",
    size: 1.5,
    extensionLength: 2
  };

  projectLayer.renderer = renderer;
`,
          before: function () {
            view.map.presentation.slides.getItemAt(4).applyTo(view);
          },

          run: function () {
            const renderer = projectLayer.renderer.clone();
            const fillSymbolLayer = renderer.symbol.symbolLayers.getItemAt(0);

            fillSymbolLayer.edges = {
              type: 'sketch',
              color: "#534026",
              size: 1.5,
              extensionLength: 2
            };

            projectLayer.renderer = renderer;
          }
        }

      ]
    }
  });
