//
//  RNViewController.m
//  SM_IOS_PROJECT
//
//  Created by Shanglong Yang on 2023/2/8.
//
//  原生app接入RN代码容器
//

#import "RNViewController.h"
#import "ReactNativeManager.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@interface RNViewController ()

@end

@implementation RNViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    ReactNativeManager *delegate = [ReactNativeManager shareInstance];
    
    RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:delegate launchOptions:nil];
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                     moduleName:@"SMMobileDemo"
                                              initialProperties:nil];
    
    self.view = rootView;
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
