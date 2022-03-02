//
//  UIView+NBUIKitMainThreadGuard.m
//  iTablet
//
//  Created by SuperMap_001 on 2021/5/17.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "UIApplication+NBUIKitMainThreadGuard.h"
#import <objc/runtime.h>

static inline void com_supermap_exchangeMethod(Class clazz ,SEL originalSelector, SEL swizzledSelector){
    Method originalMethod = class_getInstanceMethod(clazz, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(clazz, swizzledSelector);
    
    BOOL success = class_addMethod(clazz, originalSelector, method_getImplementation(swizzledMethod), method_getTypeEncoding(swizzledMethod));
    if (success) {
        class_replaceMethod(clazz, swizzledSelector, method_getImplementation(originalMethod), method_getTypeEncoding(originalMethod));
    } else {
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}

@implementation UIApplication(NBUIKitMainThreadGuard)
+(void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        
        SEL needsDisplayInRectOriginalSelector = @selector(setNetworkActivityIndicatorVisible:);
        SEL needsDisplayInRectSwizzleSelector  = @selector(guard_setNetworkActivityIndicatorVisible:);
        com_supermap_exchangeMethod(self, needsDisplayInRectOriginalSelector,needsDisplayInRectSwizzleSelector);
        
    });
}

- (void)guard_setNetworkActivityIndicatorVisible:(BOOL)b
{
//  [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible:YES];
  if(![NSThread isMainThread]){
    dispatch_async(dispatch_get_main_queue(), ^{
      [self guard_setNetworkActivityIndicatorVisible:b];
    });
  }else{
    [self guard_setNetworkActivityIndicatorVisible:b];
  }
}


@end
