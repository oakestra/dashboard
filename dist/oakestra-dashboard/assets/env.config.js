(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["apiIP"] = "${API_ADDRESS}";
  window["env"]["grafanaUrl"] = "http://${GRAFANA_ADDRESS}";
})(this);
