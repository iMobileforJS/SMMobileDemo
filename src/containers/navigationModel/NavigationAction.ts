/**
 * 导航采集页面功能文件
 * 
 * 功能：
 *   stopGuide：停止导航
 *   clear：清除
 *   actual：真实导航
 *   simulate：模拟导航
 *   clearCallout：清理地图上的标注
 *   centerPoint：中心点
 * 
 */
import { TouchMode } from "@/constants"
import { LicenseUtil, Toast, TouchAction } from "@/utils"
import { /** 用户自定义事件类 CustomTools */ SIndoorNavigation, SMap, SNavigation } from "imobile_for_reactnative"
import NavigationView from './NavigationView'


/**
 * 停止导航
 * @returns
 */
async function stopGuide(): Promise<void>{
  try {
    await SNavigation.stopGuide()
  } catch (error) {
    console.warn('停止导航出错')
  }
}

/**
 * 清除
 * @param {NavigationView} that NavigationView组件实例的一个句柄 
 * @returns 
 */
async function clear(that: NavigationView): Promise<void> {
  try {
    SNavigation.clearPath()
    SIndoorNavigation.clearPath()
    SMap.clearTrackingLayer()
    SMap.removeCallout('startPoint')
    SMap.removeCallout('endPoint')
    that.showFullMap(false)
    TouchAction.setTouchMode(TouchMode.NORMAL)
    TouchAction.clearTouchPoints() // 清除起点/终点
  } catch (error) {
    console.warn('清理出错啦')
  }
}


/**
 * 真实导航
 * @param {NavigationView} that NavigationView组件实例的一个句柄
 * @returns 
 */
async function actual(that: NavigationView):Promise<void> {
  try {
    // 检验是否有许可
    let licenseType = await LicenseUtil.getLicenseType()
    if(!licenseType) {
      // 没有许可就弹出许可申请面板
      that.setState({
        licenseViewIsShow: true,
      })
      return
    }
    if (!that.navigateAble()) {
      // 是否显示完成
      return
    }
    that.showFullMap(true)
    TouchAction.setTouchMode(TouchMode.NAVIGATION_TOUCH_BEGIN)
    that.mapSelectButton?.setVisible(false)
    // 开启导航
    await SNavigation.startGuide(0)

  } catch (error) {
    console.warn("真实导航出错: " + JSON.stringify(error))
  }
}

/**
 * 模拟导航
 * @param {NavigationView} that NavigationView组件实例的一个句柄
 * @returns 
 */
async function simulate(that: NavigationView):Promise<void> {
  try {
    // 检验是否有许可
    let licenseType = await LicenseUtil.getLicenseType()
    if(!licenseType) {
      // 没有许可就弹出许可申请面板
      that.setState({
        licenseViewIsShow: true,
      })
      return
    }

    if (!that.navigateAble()) {
      return
    }
    that.showFullMap(true)
    TouchAction.setTouchMode(TouchMode.NAVIGATION_TOUCH_BEGIN)
    that.mapSelectButton?.setVisible(false)
    // 开启导航
    await SNavigation.startGuide(1)
  } catch (error) {
    console.warn("模拟导航出错: " + JSON.stringify(error))
  }
}

/**
 * 清理地图上的标注
 * @param {NavigationView} that NavigationView组件实例的一个句柄
 * @returns
 */
async function clearCallout(that: NavigationView):Promise<void> {
  try {
    // 停止导航
    await stopGuide()
    await clear(that)
    that.mapSelectButton?.setVisible(false)
    Toast.show('长按选择起点')
    // await CustomTools.clearMapCallout('')
  } catch (error) {
    Toast.show('清理失败')
  }
}

/**
 * 用户自定义方法CustomTools, 添加中心点
 * @returns
 */
async function centerPoint(): Promise<void> {
  try {
    const point = await SMap.getMapCenter()
    console.warn(point)
    // const result = CustomTools.addMapCallout(point.x, point.y, '')
    // if(!result) {
    //   Toast.show('获取中心点失败')
    // }
  } catch (error) {
    Toast.show('获取中心点异常')
  }
}

export default {
  stopGuide,
  clear,

  actual,
  simulate,
  clearCallout,
  centerPoint,
}