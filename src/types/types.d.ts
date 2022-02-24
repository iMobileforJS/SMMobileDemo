/** 点类型 */
declare interface Point {
  x: number,
  y: number,
}

declare interface LocationPoint extends Point {
  floorID?: string,
}

/** 设备数据类型 */
declare interface Device {
  orientation: string,
  width: number,
  height: number,
  safeWidth: number,
  safeHeight: number,
}

/** 标绘动画数据类型 */
declare interface AnimationWayData {
  animationMode: number,
  startTime: string,
  durationTime: string,
  startMode: number,
  wayPoints: Array<Point>,
}

/** 数据源/数据集名称 */
declare interface DATASET_SOURCE {
  datasetName: string,
  datasourceName: string,
  layerName: string,
}

declare interface PoiHistory {
  x: number,
  y: number,
  pointName: string,
  address: string,
}

declare interface TouchMode {
  // 点击监听类型
  NORMAL: 'NORMAL',
  NULL: 'NULL',
  //导航-选点
  MAP_SELECT_START_POINT: 'MAP_SELECT_START_POINT',
  MAP_SELECT_END_POINT: 'MAP_SELECT_END_POINT',
  //导航事件
  MAP_NAVIGATION: 'MAP_NAVIGATION',

  // 导航点击监听
  NAVIGATION_TOUCH_BEGIN: 'NAVIGATION_TOUCH_BEGIN',
  NAVIGATION_TOUCH_END: 'NAVIGATION_TOUCH_END',

  // 地图选点监听
  MAP_SELECT_POINT: 'MAP_SELECT_POINT',
}