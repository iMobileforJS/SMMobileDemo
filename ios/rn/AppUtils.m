//
//  AppUtils.m
//  iTablet
//
//  Created by imobile-xzy on 2019/1/28.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "AppUtils.h"
#import <UIKit/UIKit.h>
#import <CoreLocation/CLLocationManager.h>
#import "AppDelegate.h"
//#import <SMSupermap/FileTools.h>
//#import "FileTools.h"

@implementation AppUtils
RCT_EXPORT_MODULE();
RCT_REMAP_METHOD(AppExit,AppExit:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow* window = [UIApplication sharedApplication].keyWindow;
    [UIView animateWithDuration:1.0f animations:^{
      window.alpha = 0;
      //window.frame = CGRectMake(0, window.bounds.size.height, 0, 0);
    } completion:^(BOOL finished) {
      exit(0);
    }];
  });
  resolve(@(1));
  
}

RCT_REMAP_METHOD(copyAssetFileTo, copyAssetFileTo:(NSString *)fileName toPath:(NSString *)toPath resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
//    NSString* name = fileName;
//    if ([fileName hasSuffix:@".zip"]) {
//      name = [fileName stringByDeletingPathExtension];
//    }
//    NSString* srclic = [[NSBundle mainBundle] pathForResource:name ofType:@"zip"];
//    if (srclic) {
//      [FileTools createFileDirectories:toPath];
//      if (![FileTools unZipFile:srclic targetPath:toPath]) {
//        NSLog(@"拷贝数据失败");
//        resolve(@(NO));
//      } else {
//        resolve(@(YES));
//      }
//    }
    resolve(@(YES));
  } @catch (NSException *exception) {
    resolve(@(NO));
  }
}

@end
