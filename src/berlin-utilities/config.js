define([
    "esri/WebScene",
    "esri/views/SceneView",
    "esri/widgets/DirectLineMeasurement3D"
  ],
  function (
    WebScene,
    SceneView,
    DirectLineMeasurement3D,
  ) {
    let webscene, view, measurementWidget;

    const websceneId = "47e435b2d97b464e8e994aea39517537";

    return {
      title: "Berlin Utilities",

      setup: function () {

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
          environment: {
            lighting: {
              directShadowsEnabled: false,
              ambientOcclusionEnabled: true
            },
            atmosphereEnabled: true,
            starsEnabled: false
          }
        });

        window.view = view;

        // add a transparency slider
        view.ui.empty("top-left");
        view.ui.add("slider-container", "bottom-left");

        view.when(() => {
          view.map.layers.forEach(l => {
            l.when(() => {
              if (l.title == "Buildings Berlin") {
                l.opacity = 0.5;
                l.definitionExpression = "OBJECTID <> 238";
              }
            });
          });
          view.goTo({
            "position": {
              "spatialReference": {
                "latestWkid": 3857,
                "wkid": 102100
              },
              "x": 1482728.0860918157,
              "y": 6890484.307468331,
              "z": 857.141964469105
            },
            "heading": 4.816029551165902,
            "tilt": 50.4107139072403
          })
        })
      },

      steps: [

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 1: Adjust ground transparency with a slider
        //
        /////////////////////////////////////////////////////////////////////////////////

        {

          title: "Reveal underground data",

          code: `
  // update ground opacity
  on("slider-change", function (value){
    webscene.ground.opacity = value;
  });

`,
          before: function () {
            const slider = document.getElementById("opacity-slider");
            document.getElementById("opacity-slider").addEventListener("input", function (event) {
              const value = parseFloat(event.target.value);
              webscene.ground.opacity = value;
            });
          },

        },

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 2: Navigate underground
        //
        /////////////////////////////////////////////////////////////////////////////////

        {

          title: "Explore data underground",

          code: `
  // allow underground navigation
  webscene.ground.navigationConstraint = {
    type: "none"
  };
`,
          before: function () {
            view.goTo({
              "position": {
                "spatialReference": {
                  "latestWkid": 3857,
                  "wkid": 102100
                },
                "x": 1482925.1856289608,
                "y": 6891244.671538544,
                "z": -316.85717961099
              },
              "heading": 1.0534118643196637,
              "tilt": 121.75366780552754
            },
            {
              speedFactor: 0.25
            })
          },

        },

        /////////////////////////////////////////////////////////////////////////////////
        //
        //  Step 3: Add line measurement tool
        //
        /////////////////////////////////////////////////////////////////////////////////

        {

          title: "Add line measurement tool",

          code: `
const widget = new DirectLineMeasurement3D({ view: view });
view.ui.add(widget, "top-left");
`,
          before: function () {
            view.goTo({
              "position": {
                "spatialReference": {
                  "latestWkid": 3857,
                  "wkid": 102100
                },
                "x": 1483002.3052711186,
                "y": 6891756.947785727,
                "z": -71.85483561549336
              },
              "heading": 4.860752849953107,
              "tilt": 116.3015874411957
            });
          },

          run: function () {
            measurementWidget = new DirectLineMeasurement3D({
              view: view
            });
            view.ui.add(measurementWidget, "top-left");

          }
        }

      ]
    }
  });