//
//  CALayer+MainThreadGuard.m
//  iTablet
//
//  Created by zhiyan xie on 2021/5/18.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "CALayer+MainThreadGuard.h"
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

@implementation CALayer(MainThreadGuard)
+(void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        
        SEL needsLayoutOriginalSelector = @selector(layoutSublayers);
        SEL needsLayoutSwizzleSelector  = @selector(guard_layoutSublayers);
        com_supermap_exchangeMethod(self, needsLayoutOriginalSelector,needsLayoutSwizzleSelector);
    });
}

- (void)guard_layoutSublayers
{
  if(![NSThread isMainThread]){
    NSString *desc = [NSString stringWithFormat:@"%@", self.class];
    NSLog(@"+++ %@",desc);
    dispatch_async(dispatch_get_main_queue(), ^{
      [self guard_layoutSublayers];
    });
  }else{
    [self guard_layoutSublayers];
  }
  
}

//- (BOOL)UIMainThreadCheck
//{
//  BOOL bRes = true;
//    NSString *desc = [NSString stringWithFormat:@"%@", self.class];
//  if(![NSThread isMainThread]){
//    NSLog(@"+++ %@",desc);
//    bRes = false;
////    NSAssert([NSThread isMainThread], desc);
//  }
//  return bRes;
//}
@end
