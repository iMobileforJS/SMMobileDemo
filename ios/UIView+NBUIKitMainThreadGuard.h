//
//  UIView+NBUIKitMainThreadGuard.h
//  iTablet
//
//  Created by SuperMap_001 on 2021/5/17.
//  Copyright © 2021 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
NS_ASSUME_NONNULL_BEGIN

//处理IOS 子线程刷新 UI导致崩溃问题，不要删除 add xiezhy
@interface UIView(NBUIKitMainThreadGuard)
+(void)load;
@end

NS_ASSUME_NONNULL_END
