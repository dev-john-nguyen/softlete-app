# Softlete App
An iOS health and fitness application tailored for athletes and coaches to efficiently manage their training programs.

## Development
### App (IOS)
```
cd app
yarn install
cd ios
pod install
cd ...
yarn start
```

### Server
```
cd server
yarn install
yarn start
```
 
### Resources To Run Locally
https://github.com/facebook/react-native/issues/33017

https://github.com/facebook/react-native/issues/22918

https://stackoverflow.com/questions/66742033/phasescriptexecution-cp-user-error-in-react-native

https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported


### Build Project
**App**
1. Need GoogleService-Info file in Xcode Project
2. Need Development Team assigned in Xcode Project
3. Make sure to set your terminal to use **Node Version 16**
4. `yarn install` within app directory ( can run `yarn cache clean` to clear cache)
6. `cd ios` and `pod install` ( can run `pod cache clean --all`, clean build folder in Xcode, delete Pods folder, and Podfile.lock to clear cache) 
7. Back in app directory run `yarn run ios` to run the project

**Server**
1. cd server
2. `yarn install`
3. `yarn run server`
4. `pm2 logs` to see logs
