# Jasa Raharja Mobile React Native App

This is the actual mobile app using react-native

## Installation
> npm install
> react-native run-android


## Server API
* https://dev.expecc.com:9002/api-gateway

### ToDo:
* create unit test cases



# Technologies
## React Native
React native is developed by facebook to provide cross platform development. It is currently evolving and will require us to monitor the progress made and continue adapting to the releases.


## Code push
Reference: https://microsoft.github.io/code-push/docs/cli.html

### Common Commands
List Current Version android
> code-push deployment ls JasaRaharjaMobileApp-Android -k

List Current Version iOS
> code-push deployment ls JasaRaharjaMobileApp-iOS -k

Push New Version android
> code-push release-react JasaRaharjaMobileApp-Android android

Push New Version iOS
> code-push release-react JasaRaharjaMobileApp-iOS ios



## Bitrise.io
bitrise is used to build apk for android and ipa for iOS. it also perform codepush for during the build.
Currently, bitrise is configured to run on every commit to the master branch.

### ToDo:
* Add test cases in the build process
* Configure parameterized build for
** codepush release key for staging (IT Testing) and production (real user)
** server url expecc dev vs jr dev



## Crashlytics
Crashlytics is part of fabric. It is used to capture crash logs whenever app is crashed. This will be useful to capture feedback and user experience on the field.

## Answers
Answers is part of fabric. it provides statistics for analyzing app usage.
