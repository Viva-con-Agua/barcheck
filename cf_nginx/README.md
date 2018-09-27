# Angular @ CF
This folder contains the setup to deploy the barcheck app to the Cloud Foundry stack of the SAP Cloud Platform.

## Folder structure
To deploy the application, move all source files to the */source* folder and execute the following steps:
1. Login to the Clouf Foundry endpoint.
2. Change to the correct organization and space.
3. Execute the following command
```
cf push APP_NAME_PLACEHOLDER -p play-scala-starter-example-1.0-SNAPSHOT.zip -b https://github.com/cloudfoundry/java-buildpack.git
```
## Resources
[Sample NGINX setup](https://github.com/cloudfoundry/nginx-buildpack/tree/master/fixtures/mainline)
[NGINX buildpack documentation](https://docs.cloudfoundry.org/buildpacks/nginx/index.html)
[NGINX @ CF](https://docs.cloudfoundry.org/buildpacks/nginx/index.html#pushing-apps)
