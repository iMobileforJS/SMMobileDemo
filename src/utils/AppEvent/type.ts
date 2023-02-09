import { Pose } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import { ARElement } from "imobile_for_reactnative/types/interface/ar"



/**
 * 事件及其对应参数
 */
export interface Event {
  //ar地图添加事件
  'ar_map_add_start': undefined
  //ar地图添加结束事件
  'ar_map_add_end': undefined
  //ar地图清除动画列表等事件
  'ar_map_add_undo': undefined
  //ar地图添加按钮事件
  'ar_on_tap_add_buttun': undefined
  //AR对象添加到场景回调事件
  'ar_map_on_add_element': ARElement

  'ar_sandtable_add': undefined
  'ar_sandtable_add_end': undefined
  'ar_sandtable_on_add': undefined

  'ar_animation_save': undefined
  'ar_animation_play': undefined
  'ar_animation_exit': undefined

  'ar_image_tracking_result': Pose

  'ar_single_click':undefined
  'show_ar_map': boolean
  'on_ar_mapview_loaded': undefined

  'ar_3dmap_attribute': undefined
}