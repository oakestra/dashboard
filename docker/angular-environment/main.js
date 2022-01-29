/**
 * This file is run post-build to create an IIFE in index.html. That IIFE
 * will contain the name variables used to run the container.
 */
const assc = require('angular-server-side-configuration');
const root = '/usr/share/nginx/html';
const envVariables = assc.EnvironmentVariablesConfiguration.searchEnvironmentVariables(root);
envVariables.insertAndSaveRecursively(root);
