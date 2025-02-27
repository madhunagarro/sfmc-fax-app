define(["postmonger"], function (Postmonger) {
    "use strict";
  
    var connection = new Postmonger.Session();
    var payload = {};
    var steps = [{ label: "Step 1", key: "step1" }];
    var currentStep = steps[0].key;
  
    $(window).ready(onRender);
  
    connection.on("initActivity", initialize);
    connection.on("clickedNext", onClickedNext);
    connection.on("clickedBack", onClickedBack);
    connection.on("gotoStep", onGotoStep);
  
    function onRender() {
      connection.trigger("ready");
    }
  
    function initialize(data) {
      if (data) {
        payload = data;
      }
      connection.trigger("updateButton", { button: "next", enabled: true });
    }
  
    function onClickedNext() {
      connection.trigger("nextStep");
    }
  
    function onClickedBack() {
      connection.trigger("prevStep");
    }
  
    function onGotoStep(step) {
      currentStep = step;
    }
  });
  