# Table of Contents
**[General information and project management](#general-information-and-project-management)**<br>
[Prototype](#prototype)
**[Technical Insights](#technical-insights)**<br>
[Testing](#testing)<br>
[Base structure of the app](#base-structure-of-the-app)<br>
**[Q&A](#questions-and-answers)**<br>

This small guide contains everything important to jump into development.
The implementation is based on AngularJS and further Web-Development Frameworks (see list below)
AngularJS is a Framework to design Single-Page-Applications. Get basic information about AngularJS [here](https://angularjs.org/).

# General information and project management

## Documents
All documents related to the barcheck mircoservice are linked below. <br>
[Architecture](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/Architecture.pdf) <br>
[Hybrid vs. SPA](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/Hybrid%20vs.%20SPA.pdf) <br>
[Requirements: Prototype, Minimum & Most](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/Prototype%2C%20Minimal%20%26%20Most.pdf) <br>
[Prototype Barchecker](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/170804_Pool%3F_Barchecker_Teszenario.pdf) <br>
[Prototype Data Persistence](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/Prototype%20Data%20Persistence.pdf) <br>
[OData & Communication](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/OData%20%26%20Communication.pdf) <br>
[UI Element Definition](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/Define_UI_Elements_for_VcA_app.pdf) <br>
[Prototype Authentication & Firebase](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/Prototype%20Authentication%20%26%20Firebase.md)<br>
[Testphase](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/Testphase.pptx)


NOTE: Please update PDFs in projectmanagement/PDFs after changing the .pptx files!

## Helpful links and resources
- [Deployment link](https://vivaconagua-acb28be61.dispatcher.hana.ondemand.com/?hc_reset) on SAP Cloud Platform
- [ZenHub Board](https://app.zenhub.com/workspace/o/viva-con-agua/barcheck/boards?repos=95428427) for Issue Tracking
- [AnglarJS Material](https://material.angularjs.org/latest/)
- [Material Design Icons](https://material.io/icons/#ic_mail)
- [Technology Choice](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/Technology%20Choice.pdf)
- [Mixpanel](https://mixpanel.com)


## Used Frameworks (beside basic AngularJS)
- AngularJS Material
- jQuery

## Stable / Presentation Version
There is a stable version for presentations that contains some mock up feature for the presentation purpose. You can find the deployment link [here](https://barcheckshow-acb28be61.dispatcher.hana.ondemand.com/?hc_reset).

## Prototype

**General Idea:**
[Prototype Data Persistence](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/Prototype%20Data%20Persistence.pdf) <br>
**ODATA & Communication:**
[Technical Background Information](https://github.com/Viva-con-Agua/barcheck/blob/master/projectmanagement/PDFs/OData%20%26%20Communication.pdf)
# Technical Insights

## Development Setup
For continuing the development you could either use local development with an editor of your choice or SAP's Web IDE.

### Local
1. Get NodeJS if you haven't yet (will be needed for testing to)
2. Install the 'http-server'-Module
```
npm install http-server -g
```
3. Run the http-server from console
```
http-server
```
The app will be available via localhost:8080

### Web-IDE
1. Open and login
2. Clone this repository
3. Edit / Run the App (-> No webserver specification required, because the Web-IDE provides one for the runtime of the app)

## Testing
### End-to-end testing
We use [Protractor](http://www.protractortest.org/#/) for end-to-end testing. The Protractor tests do not replace Unit Testing!

#### Initial local Setup
0. Install node.js (if you haven't done yet)

1. Navigate to the root directory of this project and execute
```
npm install
```
2. Run the following command to finalize the test setup
```
npm run prep
```

#### Test execution
1. Open a new command line window and navigate to the project's root directory

2. Run the following command to start a server that serves the source code files for testing
```
npm run server
```
3. Run the Protractor tests by executing the following command
```
npm run e2e
```

#### Writing Tests
See the Protractor API reference for the syntax. The test-spec.js file contains the most important commands.

### Unit-tests
TODO

## Working with custom directives
See [this](https://github.com/Viva-con-Agua/barcheck/commit/d279760a3f269ec2b6834eda5842398ec40307ae) commit to get an idea of how to modularize your code to delete duplicates.

## Structure and Routing
For routing, the app uses UI-Routing from AngularJS UI. In contrast to the routing concept of AngularJS, it is state based and not URL based. Check the following [article](https://ui-router.github.io/ng1/)

### Base structure of the app
The app is based on the index.html which is also the target file for deployment. The following picture shows an extract of the index.html containing the navigation and the containers for dynamic content.
<img src="/projectmanagement/documentation/indexExtract.png" alt="image missing" style="height: 100px;"/>
The yellow rectangle marks the 'sideBar' directive that is used for the slide-in menu of the app. It is triggered by the button within the app's toolbar (marked by green rectangle) which sticks at the top of the app through the whole app to enable to user to jump between the mains menus in every time. The most important part is marked by the red rectangle. The 'div' with the directive 'ui-view' will be a container for the dynamic content that changes with the change of the state.
### Navigate using the Routing
The config.js file contains the configuration of the states.
You can change states the following two ways:
- Using the Angular UI directive 'ui-sref':
[Further information](https://github.com/angular-ui/ui-router/wiki/quick-reference)
- From coding
```javascript
$state.go('state_name');
```
NOTE: The controller this snippet is called from must include $state as a dependency.

## Services
To get a basic knowledge of the idea of services, check out [this](https://docs.angularjs.org/guide/services) page.

### Design Service
TBD

### Location Service
TBD

### Progress Service
TBD

### Contacts Service
TBD

# Questions and Answers
- **My changes are not applied after saving and reloading..?** <br>
Empty the cache ([help](https://www.technipages.com/google-chrome-clear-cache)). <br>
- **Why a presentation AND a development version?** <br>
The presentation version is just to win sponsors and for demos. Its functionality is some versions behind the development version. We deploy the development version from time to time to test new features under deployment conditions. So if you want to see the newest version use the Development version. <br>
- **What is the neo-app.json and the .project.json file for?** <br>
The neo-app-json and .project.json file are  configuration files for the SAP Cloud Platform Deployment. They updates with every deployment so don't be scared if one is marked as changed by git after you deployed it. Like all other changes, you can stage and commit them.
