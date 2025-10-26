'use strict';
module.exports = {
  app_name: ['Meu-App-K8s'],  // Nome no dashboard
  license_key: 'NEW_RELIC_APP_NAME=k8s NEW_RELIC_LICENSE_KEY=b4f962a57a224623c28eca7b518a7b0dFFFFNRAL node -r newrelic server.js',  // Pega no New Relic (grátis trial)
  logging: {
    level: 'info'
  },
  distributed_tracing: {
    enabled: true
  }
};