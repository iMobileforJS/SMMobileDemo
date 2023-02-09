import { screen } from "@/utils"
import { ImageStyle, TextStyle, ViewStyle } from "react-native"
import color from "./color"

export const Image_Style: ImageStyle = {
  width: screen.px2dp(25),
  height: screen.px2dp(25),
}

export const Image_Style_Small: ImageStyle = {
  width: screen.px2dp(18),
  height: screen.px2dp(18),
}

// ********* 文字风格 *********
// 从大到小: h1, h2, h3, h4....
// 后缀含义：
// c: center中心排列；
// g: gray，灰色字体；

export const h1: TextStyle = {
  fontSize: screen.px2dp(18),
  color: color.BLACK,
}

export const h2: TextStyle = {
  fontSize: screen.px2dp(14),
  color: color.BLACK,
}

export const h3: TextStyle = {
  fontSize: screen.px2dp(12),
  color: color.BLACK,
}

/** h2 gray */
export const h2g: TextStyle = {
  ...h2,
  color: color.GRAY,
}

/** h2 center */
export const h2c: TextStyle = {
  ...h2,
  textAlign: 'center'
}

/** @deprecated 使用 AppStyle.h2 */
export const Text_Style: TextStyle = h2

/** @deprecated 使用 AppStyle.h3 */
export const Text_Style_Small: TextStyle = h3

/** @deprecated 使用 AppStyle.h2c */
export const Text_Style_Center: TextStyle = h2c

/** @deprecated */
export const Text_Style_Small_Center: TextStyle = {
  ...h3,
  textAlign: 'center',
  fontSize: screen.px2dp(10)
}

/** 悬浮风格 */
export const FloatStyle: ViewStyle = {
  elevation: 3,
  shadowOffset: { width: 0, height: 0 },
  shadowColor: '#eee',
  shadowOpacity: 1,
  shadowRadius: 2,
}

/** 分割线风格 */
export const SeperatorStyle: ViewStyle ={
  width: '100%',
  height: screen.px2dp(1),
  backgroundColor: color.Seperator,
}

/** list item 通用风格 */
export const ListItemStyle: ViewStyle = {
  height: screen.px2dp(46),
  marginLeft: screen.px2dp(20),
  paddingRight: screen.px2dp(16),
  borderBottomColor: color.Seperator,
  borderBottomWidth: screen.px2dp(1),
  flexDirection: 'row',
  alignItems: 'center'
}

/** list item 通用风格, 无分割线 */
export const ListItemStyleNS: ViewStyle = {
  height: screen.px2dp(47),
  marginLeft: screen.px2dp(20),
  paddingRight: screen.px2dp(16),
  flexDirection: 'row',
  alignItems: 'center'
}

/** Button 组件风格 */
export const ButtonStyle: ViewStyle = {
  height: screen.px2dp(45),
  minWidth: screen.px2dp(60),
  backgroundColor: color.Button_Dark,
  borderColor: color.Button_Dark,
  borderWidth: screen.px2dp(1),
  borderRadius: screen.px2dp(15),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: screen.px2dp(10),
  alignSelf: 'center'
}

/** Button 组件文字风格 */
export const ButtonTextStyle: TextStyle = {
  textAlign: 'center',
  fontSize: screen.px2dp(12),
  color: color.WHITE,
  marginHorizontal: screen.px2dp(5)
}

/** Button 组件图片风格 */
export const ButtomImageStyle: ImageStyle = {
  width: screen.px2dp(25),
  height: screen.px2dp(25),
  marginHorizontal: screen.px2dp(5)
}

/** 输入框背景风格 */
export const inputBackgroud: ViewStyle = {
  backgroundColor: color.Background_Container,
  width: '100%',
  height: screen.px2dp(50),
  borderRadius: screen.px2dp(40),
  paddingHorizontal: screen.px2dp(10),
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: screen.px2dp(20),
}

/** 输入框文字风格 */
export const textInputStyle: TextStyle =  {
  width: '100%',
  fontSize: screen.px2dp(16),
  color: color.Text_Input,
  textAlign: 'center',
}
