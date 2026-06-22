(function(window) {
  window.env = window.env || {};

  // Environment variables
  window["env"]["apiIP"] = "${API_ADDRESS}";
  window["env"]["grafanaAddress"] = "${GRAFANA_ADDRESS}";
  window["env"]["httpsEnabled"] = "${HTTPS_ENABLED}";
})(this);
