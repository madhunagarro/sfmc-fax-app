define(["postmonger"], function (Postmonger) {
    "use strict";
  
    var connection = new Postmonger.Session();
    var payload = {};
    var steps = [{ label: "Step 1", "key": "step1" }];
    var currentStep = steps[0].key;
  
    $(window).ready(onRender);
  
    connection.on("initActivity", initialize);
    connection.on("clickedNext", onClickedNext);
    connection.on("clickedBack", onClickedBack);
    connection.on("gotoStep", onGotoStep);
  
    function onRender() {
      connection.trigger("ready");
      connection.trigger("requestTokens");
      connection.trigger("requestEndpoints");
    }
  
    function initialize(data) {
      if (data) {
        payload = data;
      }
    }
  
    function onClickedNext() {
      save();
    }
  
    function onClickedBack() {
      connection.trigger("prevStep");
    }
  
    function onGotoStep(step) {
      showStep(step);
      connection.trigger("ready");
    }
  
    function showStep(step) {
      if (step) {
        currentStep = step;
      }
      $(".step").hide();
      $("#" + currentStep.key).show();
    }
  
    function save() {
      payload["arguments"].execute.inArguments = [{
        faxNumber: "{{Contact.Attribute.FaxNumber}}"
      }];
      payload["metaData"].isConfigured = true;
      connection.trigger("updateActivity", payload);
    }
  });