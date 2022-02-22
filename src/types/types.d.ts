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
  //标注事件
  MAP_MARKS_TAGGING: 'MAP_MARKS_TAGGING',
  //导航事件
  MAP_NAVIGATION: 'MAP_NAVIGATION',

  // 网络分析事件
  SET_START_STATION: 'SET_START_STATION',
  MIDDLE_STATIONS: 'MIDDLE_STATIONS',
  SET_END_STATION: 'SET_END_STATION',
  LOCATION: 'LOCATION',
  SET_AS_START_STATION: 'SET_AS_START_STATION',
  SET_AS_END_STATION: 'SET_AS_END_STATION',
  ADD_STATIONS: 'ADD_STATIONS',
  ADD_BARRIER_NODES: 'ADD_BARRIER_NODES	',
  ADD_NODES: 'ADD_NODES',

  // 邻近分析
  REFERENCE: 'REFERENCE',

  // 创建动画路径
  ANIMATION_WAY: 'ANIMATION_WAY',

  // 导航点击监听
  NAVIGATION_TOUCH_BEGIN: 'NAVIGATION_TOUCH_BEGIN',
  NAVIGATION_TOUCH_END: 'NAVIGATION_TOUCH_END',
  //导航模块 拓扑编辑
  MAP_TOPO_SPLIT_BY_POINT: 'MAP_TOPO_SPLIT_BY_POINT', //点线打断
  MAP_TOPO_EXTEND_LINE: 'MAP_TOPO_EXTEND_LINE', //线延长
  MAP_TOPO_TRIM_LINE: 'MAP_TOPO_TRIM_LINE', //线修剪
  // 视频地图AR模式下点击
  AIMAPTOUCH: 'AIMAPTOUCH',

  // 地图选点监听
  MAP_SELECT_POINT: 'MAP_SELECT_POINT',
}