define([
    "esri/WebScene",
    "esri/views/SceneView",
    "esri/core/scheduling",
    "esri/core/watchUtils",
    "esri/widgets/DirectLineMeasurement3D"
  ],
  function (
    WebScene,
    SceneView,
    scheduling,
    watchUtils,
    DirectLineMeasurement3D,
  ) {
    let webscene, view, measurementWidget;

    let schedulerHandler = null; // for animation

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

          watchUtils.watch(view, "interacting", function(r) {
            const c = view.camera.clone();
            console.log('camera', "position: " + JSON.stringify(c.position) + ", 'tilt:' " + c.tilt + ", 'heading:' " + c.heading );
          });

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
                "z": -2
              },
              "heading": 1,
              "tilt": 93
            },
            {
              speedFactor: 0.15
            }).then(()=> {



            //   let counter = 20;
            //
            //   schedulerHandler = scheduling.addFrameTask({
            //     update: function() {
            //       let camera = view.camera.clone();
            //
            //       if(counter > -15){
            //         camera.position.z = counter;
            //       }
            //       else {
            //         schedulerHandler.remove();
            //       }
            //
            //       counter -= 0.025;
            //
            //       view.camera = camera;
            //     }
            //   });
            });
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
const widget = new DirectLineMeasurement3D({
  view: view });
view.ui.add(widget, "top-left");
`,
          before: function () {

            webscene.ground.opacity = 0;

            view.goTo({
              "position": {
                "spatialReference": {
                  "latestWkid": 3857,
                  "wkid": 102100
                },
                "x":1482999.5294966262,"y":6891666.1721912725,"z":33.17705403268337
                // "x": 1483008.705243374,
                // "y": 6891690.046967333,
                // "z": 34.6289804764
              },
              "heading": 4.8,
              "tilt": 90.21999994733906
            });
          },

          run: function () {
            measurementWidget = new DirectLineMeasurement3D({
              view: view,
              unit: "feet"
            });
            view.ui.add(measurementWidget, "top-left");

          }
        }

      ]
    }
  });