/**
 * 地图浏览的功能文件
 * 
 * 包含方法如下：
 * fullScreen：全幅
 * 离线地图：
 *   1）openHunanMap： 打开湖南地图
 *   2）openChenduMap：打开成都地图 
 * 在线地图：
 *   1）openTiandituMap：打开天地图
 *   2）打开BingMap地图： 打开BingMap地图
 * 
 */
import { DEFAULT_DATA_MAP_FILE } from "./config"
import { ConstOnline, ConstPath, DEFAULT_USER_NAME } from "@/constants"
import { FileTools, SMap } from "imobile_for_reactnative"
import MapBrowsingView from "./MapBrowsingView"

/**
 * 全幅
 * @returns
 */
export function fullScreen(): void {
  try {
    SMap.viewEntire()
  } catch (error) {
    console.warn("全幅操作失败")
  }
}

/**
 * 打开湖南地图
 * @param {MapBrowsingView} that  MapBrowsingView组件实例的一个句柄
 * @returns
 */
export async function openHunanMap(that: MapBrowsingView): Promise<void> {
  // 将地图切换为湖南
  const home = await FileTools.appendingHomeDirectory()
  // 数据所在工作空间的路径
  const path = `${home + ConstPath.ExternalData}/${DEFAULT_DATA_MAP_FILE}/湖南/Hunan.smwu`
  // 数据导入成功后地图数据所在的路径
  const mapPath = `${home + ConstPath.UserPath + DEFAULT_USER_NAME}/${ConstPath.RelativeFilePath.Map}湖南.xml`
  // 调用MapView的切换地图方法
  debugger
  that.changeMap(true, true, {name:'湖南', path: mapPath}, path)
}

/**
 * 打开成都地图
 * @param {MapBrowsingView} that  MapBrowsingView组件实例的一个句柄
 * @returns
 */
export async function openChenduMap(that: MapBrowsingView): Promise<void> {
  // 将地图切换为成都
  const home = await FileTools.appendingHomeDirectory()
  // 数据所在工作空间的路径
  const path = `${home + ConstPath.ExternalData}/${DEFAULT_DATA_MAP_FILE}/Chengdu/Chengdu.smwu`
  // 数据导入成功后地图数据所在的路径
  const mapPath = `${home + ConstPath.UserPath + DEFAULT_USER_NAME}/${ConstPath.RelativeFilePath.Map}成都区域电子地图.xml`
  // 调用MapView的切换地图方法
  that.changeMap(true, true, {name:'成都区域电子地图', path: mapPath}, path)
}

/**
 * 打开天地图
 * @param {MapBrowsingView} that  MapBrowsingView组件实例的一个句柄
 * @returns
 */
export function openTiandituMap(that: MapBrowsingView, isChange: boolean): void {
  // 天地图的数据
  let tiandituData = [
    ConstOnline.tiandituCN(),
    ConstOnline.tiandituImg(),
  ]
  // 调用MapView的切换地图方法
  that.changeMap(false, isChange, tiandituData)
}

/**
 * 打开BingMap地图
 * @param {MapBrowsingView} that  MapBrowsingView组件实例的一个句柄
 * @returns
 */
export function openBingMap(that: MapBrowsingView): void {
  // BingMap的数据
  let bingMapData = [
    ConstOnline.BingMap,
  ]
  // 调用MapView的切换地图方法
  that.changeMap(false, true, bingMapData)
}


