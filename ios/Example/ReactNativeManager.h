//
//  ReactNativeManager.h
//  SM_IOS_PROJECT
//
//  Created by Shanglong Yang on 2023/2/8.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeDelegate.h>

NS_ASSUME_NONNULL_BEGIN

@interface ReactNativeManager : NSObject<RCTBridgeDelegate>

+ (instancetype)shareInstance;

// 全局唯一的bridge
@property (nonatomic, readonly, strong) RCTBridge *bridge;

@end

NS_ASSUME_NONNULL_END
