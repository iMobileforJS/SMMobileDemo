import { RouteProp } from '@react-navigation/native'
/************ navigator 各个页面参数 type **********************************/

/** 主stack所有页面参数 */
export type MainStackParamList = {
  Home: undefined,
  NavigationView: undefined,
}

/************* 所有页面 navigation prop type *****************************/

/************* 所有页面 route prop type ***********************************/

/** MainStack 内所有页面通用 route prop */
export type MainStackScreenRouteProp<RouteName extends keyof MainStackParamList> = RouteProp<MainStackParamList, RouteName>
