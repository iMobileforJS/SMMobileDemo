
import { NavigationContainerRef } from '@react-navigation/native'
import {
  MainStackParamList,
} from '../types'

type ParamList = MainStackParamList

let navigation: NavigationContainerRef<MainStackParamList>

export function setNavigation(ref: NavigationContainerRef<MainStackParamList> | null) {
  if(!ref) return
  navigation = ref
}


export function navigate<RouteName extends keyof ParamList>(...args: undefined extends ParamList[RouteName] ? [RouteName] | [RouteName, ParamList[RouteName]] : [RouteName, ParamList[RouteName]]): void
/** 用于向嵌套navigator传递参数 */
export function navigate<RouteName extends keyof ParamList, SRouteName extends keyof ParamList>(key: RouteName, params: {
  screen: SRouteName
  params: ParamList[SRouteName]
}): void
export function navigate<RouteName extends keyof ParamList>(...args: undefined extends ParamList[RouteName] ? [RouteName] | [RouteName, ParamList[RouteName]] : [RouteName, ParamList[RouteName]]) {
  navigation.navigate(...args)
}