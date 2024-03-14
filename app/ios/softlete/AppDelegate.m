#import "AppDelegate.h"
#import "RCTAppleHealthKit.h"
#import <Firebase.h>

#import <React/RCTBundleURLProvider.h>

#import <UMCore/UMModuleRegistry.h>
#import <UMReactNativeAdapter/UMNativeModulesProxy.h>
#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>

@interface AppDelegate () <RCTBridgeDelegate>
 
@property (nonatomic, strong) UMModuleRegistryAdapter *moduleRegistryAdapter;
 
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"softlete";
  self.initialProps = @{};
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self
                                            launchOptions:launchOptions];
    
  
  // Add me --- \/
  [FIRApp configure];
  // Add me --- /\
    
  
  /* Add Background initializer for HealthKit  */
  [[RCTAppleHealthKit new] initializeBackgroundObservers:bridge];
  
  bool didFinish = [super application:application didFinishLaunchingWithOptions:launchOptions];
  
  return didFinish
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


@end
