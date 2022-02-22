import { TouchMode } from "@/constants"

/**
 * 点击事件工具类
 */
let isDoubleTouchCome = false
let touchMode: TouchMode[keyof TouchMode] = TouchMode.NORMAL

/**
 * 设置地图触摸类型
 * @param mode
 */
function setTouchMode(mode: TouchMode[keyof TouchMode]) {
  touchMode = mode
}

/**
 * 获取地图触摸类型
 * @returns
 */
function getTouchMode() {
  return touchMode
}

/**
 * 防止多次点击
 * @returns
 */
async function isDoubleTouchComing() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(isDoubleTouchCome)
      isDoubleTouchCome = false
    }, 200)
  })
}

let startPoint: LocationPoint | null
let endPoint: LocationPoint | null
/**
 * 设置地图触摸类型
 * @param mode
 */
function setTouchStartPoint(point: LocationPoint) {
  startPoint = point
}

function setTouchStartFloorID(floorID: string) {
  if (startPoint) {
    startPoint.floorID = floorID
  }
}

/**
 * 获取地图触摸类型
 * @returns
 */
function getTouchStartPoint() {
  return startPoint || { x: 0, y: 0, floorID: '' }
}

/**
 * 设置地图触摸类型
 * @param mode
 */
function setTouchEndPoint(point: LocationPoint) {
  endPoint = point
}

function setTouchEndFloorID(floorID: string) {
  if (endPoint) {
    endPoint.floorID = floorID
  }
}

/**
 * 获取地图触摸类型
 * @returns
 */
function getTouchEndPoint() {
  return endPoint || { x: 0, y: 0, floorID: '' }
}

function clearTouchPoints() {
  endPoint = null
  startPoint = null
}

export default {
  setTouchMode,
  getTouchMode,
  isDoubleTouchComing,

  setTouchStartPoint,
  getTouchStartPoint,
  setTouchEndPoint,
  getTouchEndPoint,
  setTouchStartFloorID,
  setTouchEndFloorID,
  clearTouchPoints,
}