/**
 * 地图触摸事件类型
 */
const MTouchMode: {[key: string]: TouchMode[keyof TouchMode]} = {
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

  // 地图浏览-添加点
  MAP_CREATE_POINT: 'MAP_CREATE_POINT',
  // 地图浏览-添加线
  MAP_CREATE_LINE: 'MAP_CREATE_LINE',
  // 地图浏览-添加面
  MAP_CREATE_REGION: 'MAP_CREATE_REGION',
}

export default MTouchMode