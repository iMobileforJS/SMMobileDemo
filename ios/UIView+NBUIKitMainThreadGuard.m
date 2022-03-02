//
//  UIView+NBUIKitMainThreadGuard.m
//  iTablet
//
//  Created by SuperMap_001 on 2021/5/17.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import "UIView+NBUIKitMainThreadGuard.h"
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

@implementation UIView (NBUIKitMainThreadGuard)
+(void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        
        SEL needsLayoutOriginalSelector = @selector(setNeedsLayout);
        SEL needsLayoutSwizzleSelector  = @selector(guard_setNeedsLayout);
        com_supermap_exchangeMethod(self, needsLayoutOriginalSelector,needsLayoutSwizzleSelector);
        
        SEL needsDisplaOriginalSelector = @selector(setNeedsDisplay);
        SEL needsDisplaSwizzleSelector  = @selector(guard_setNeedsDisplay);
        com_supermap_exchangeMethod(self, needsDisplaOriginalSelector,needsDisplaSwizzleSelector);
        
        SEL needsDisplayInRectOriginalSelector = @selector(setNeedsDisplayInRect:);
        SEL needsDisplayInRectSwizzleSelector  = @selector(guard_setNeedsDisplayInRect:);
        com_supermap_exchangeMethod(self, needsDisplayInRectOriginalSelector,needsDisplayInRectSwizzleSelector);
        
    });
}

- (void)guard_setNeedsLayout
{
  if(![NSThread isMainThread]){
    dispatch_async(dispatch_get_main_queue(), ^{
      [self guard_setNeedsLayout];
    });
  }else{
    [self guard_setNeedsLayout];
  }
}

- (void)guard_setNeedsDisplay
{
  if(![NSThread isMainThread]){
    dispatch_async(dispatch_get_main_queue(), ^{
      [self guard_setNeedsDisplay];
    });
  }else{
    [self guard_setNeedsDisplay];
  }
    
}


- (void)guard_setNeedsDisplayInRect:(CGRect)rect
{
  if(![NSThread isMainThread]){
    dispatch_async(dispatch_get_main_queue(), ^{
      [self guard_setNeedsDisplayInRect:rect];
    });
  }else{
    [self guard_setNeedsDisplayInRect:rect];
  }
    
}

- (void)UIMainThreadCheck
{
    NSString *desc = [NSString stringWithFormat:@"%@", self.class];
  if(![NSThread isMainThread]){
    NSLog(@"+++ %@",desc);
//    NSAssert([NSThread isMainThread], desc);
  }
   
}
@end
