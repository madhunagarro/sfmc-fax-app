define(['postmonger'], function (Postmonger) {
  var connection = new Postmonger.Session();
  var payload = {};
  var steps = [
      { label: "Step 1", key: "step1" },
      { label: "Step 2", key: "step2" }
  ];
  var currentStep = steps[0].key;

  $(window).ready(onRender);
  connection.on("initActivity", initialize);
  connection.on("clickedNext", onClickedNext);
  connection.on("clickedBack", onClickedBack);
  connection.on("gotoStep", onGotoStep);

  function onRender() {
      connection.trigger("ready");

      fetch('/config.json')
          .then(response => response.json())
          .then(config => {
              console.log("✅ Loaded Config:", config);
          })
          .catch(error => console.error("❌ Error loading config.json", error));
  }

  function initialize(data) {
      if (data) {
          payload = data;
      }

      var hasInArguments = Boolean(
          payload.arguments &&
          payload.arguments.execute &&
          payload.arguments.execute.inArguments &&
          payload.arguments.execute.inArguments.length > 0
      );

      if (!hasInArguments) {
          showStep(null, 1);
          connection.trigger("updateButton", { button: "next", enabled: false });
      } else {
          showStep(null, 2);
      }
  }

  function onClickedNext() {
      if (currentStep === "step2") {
          save();
      } else {
          connection.trigger("nextStep");
      }
  }

  function onClickedBack() {
      connection.trigger("prevStep");
  }

  function onGotoStep(step) {
      showStep(step);
  }

  function showStep(step, stepIndex) {
      if (stepIndex && !step) {
          step = steps[stepIndex - 1];
      }
      currentStep = step;
      console.log(`📌 Navigating to Step: ${currentStep}`);
  }

  function save() {
      payload.name = "Fax Integration";
      payload.arguments.execute.inArguments = [
          { faxNumber: "{{Event.FaxNumber}}" },
          { documentUrl: "{{Event.DocumentUrl}}" }
      ];
      payload.metaData.isConfigured = true;

      connection.trigger("updateActivity", payload);
  }
});
