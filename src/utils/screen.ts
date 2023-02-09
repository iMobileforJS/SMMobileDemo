import { Dimensions, PixelRatio, Platform } from 'react-native'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'

const defaultPixel = PixelRatio.get() // iphone6的像素密度
const dp2px = (dp: number) => PixelRatio.getPixelSizeForLayoutSize(dp) // DP to PX
const px2dp = (px: number) => PixelRatio.roundToNearestPixel(px) // PX to DP
let deviceWidth: number = getScreenWidth() // Dimensions.get('window').width //设备的宽度
let deviceHeight: number = getScreenHeight() // Dimensions.get('window').height //设备的高度
let deviceSafeHeight: number = 0 // 设备安全高度

const screenWidth = Math.min(
  Dimensions.get('window').width,
  Dimensions.get('window').height,
)

// eslint-disable-next-line no-unused-vars
const screenHeight = Math.max(
  Dimensions.get('window').width,
  Dimensions.get('window').height,
)

function getScreenWidth(orientation?: string) {
  deviceWidth = Dimensions.get('window').width
  if (!orientation) return deviceWidth
  if (orientation.indexOf('LANDSCAPE') === 0) {
    deviceWidth = Math.max(
      Dimensions.get('window').height,
      Dimensions.get('window').width,
    )
  } else if (orientation.indexOf('PORTRAIT') >= 0) {
    deviceWidth = Math.min(
      Dimensions.get('window').height,
      Dimensions.get('window').width,
    )
  }
  return deviceWidth
}
function getScreenHeight(orientation?: string) {
  deviceHeight = Dimensions.get('window').height
  if (!orientation) return deviceHeight
  if (orientation.indexOf('LANDSCAPE') === 0) {
    deviceHeight = Math.min(
      Dimensions.get('window').height,
      Dimensions.get('window').width,
    )
  } else if (orientation.indexOf('PORTRAIT') >= 0) {
    deviceHeight = Math.max(
      Dimensions.get('window').height,
      Dimensions.get('window').width,
    )
  }
  return deviceHeight
}

function getScreenSafeHeight(orientation?: string) {
  if (Platform.OS === 'ios') {
    const _orientation = orientation || getOrientation()
    let paddings = 0
    if (isIphoneX() && _orientation.indexOf('PORTRAIT') >= 0) {
      paddings = X_BOTTOM + X_TOP
    }
    return getScreenHeight(orientation) - paddings
  }
  // let screenHeight = ExtraDimensions.getRealWindowHeight()
  if (!orientation) {
    deviceSafeHeight = ExtraDimensions.getRealWindowHeight()
  } else if (orientation.indexOf('LANDSCAPE') === 0) {
    deviceSafeHeight = Math.min(
      ExtraDimensions.getRealWindowHeight(),
      ExtraDimensions.getRealWindowWidth(),
    )
  } else if (orientation.indexOf('PORTRAIT') >= 0) {
    let screenHeight = Math.max(
      ExtraDimensions.getRealWindowHeight(),
      ExtraDimensions.getRealWindowWidth(),
    )
    deviceSafeHeight = screenHeight - ExtraDimensions.getStatusBarHeight()
  }
  // const temp = ExtraDimensions.getRealWindowWidth()
  // if (screenHeight < temp) {
  //   screenHeight = temp
  // }
  // deviceSafeHeight = screenHeight - ExtraDimensions.getStatusBarHeight()
  return deviceSafeHeight
}

function getScreenSafeWidth(orientation?: string) {
  if (Platform.OS === 'ios') {
    const _orientation = orientation || getOrientation()
    let paddings = 0
    if (isIphoneX() && _orientation.indexOf('LANDSCAPE') >= 0) {
      paddings = X_TOP
    }
    return getScreenWidth(orientation) - paddings
  } else {
    return getScreenWidth(orientation)
  }
}

function getRatio(): number {
  const height = Math.max(deviceHeight, deviceWidth)
  let ratio: number
  if (height < 700) {
    ratio = 0.75
  } else if (height < 800) {
    ratio = 0.8
  } else if (height < 1000) {
    ratio = parseFloat((Math.max(deviceHeight, deviceWidth) / 1000.0).toFixed(2))
  } else {
    ratio = 1
  }
  return ratio
}

/**
 * 设置尺寸的大小
 * @param size: 单位：px （720*1080为模板标记的原始像素值）
 * return number dp
 */
export function scaleSize(size: number) {
  size = Math.round(size * 0.7 * getRatio())
  return size
}

export function setSpText(size: number) {
  size = size * (Platform.OS === 'ios' ? 0.8 : 0.7) * getRatio()
  return size
}

let orientation = ''
function setOrientation(o: string) {
  if (o) {
    orientation = o
  }
}

function getOrientation() {
  if (orientation === '') {
    return getScreenHeight() > getScreenWidth() ? 'PORTRAIT' : 'LANDSCAPE'
  }
  return orientation
}

// iPhoneX
const X_WIDTH = 375
const X_HEIGHT = 812
const IOS_TOP = 20
const X_TOP = 35
const X_BOTTOM = 35
const X_BOTTOM_L = 20

function isIphoneX() {
  if (Platform.OS === 'ios') {
    const { isPad } = Platform
    if (!isPad) {
      const h = getScreenHeight()
      const w = getScreenWidth()
      if (Math.min(w, h) >= X_WIDTH && Math.max(w, h) >= X_HEIGHT) {
        return true
      }
    }
  }

  return false
}

/**
 * 获取iphone和iphone X顶部距离
 * @returns {number}
 */
function getIphonePaddingTop(orientation?: string) {
  let paddingTop = 0
  if (Platform.OS === 'android') {
    return paddingTop
  }
  const _orientation = orientation || getOrientation()
  if (_orientation.indexOf('PORTRAIT') < 0) return paddingTop
  if (isIphoneX()) {
    paddingTop = X_TOP
  } else if (Platform.OS === 'ios') {
    paddingTop = IOS_TOP
  }
  return paddingTop
}

/**
 * 获取iphone和iphone X底部距离
 * @returns {number}
 */
function getIphonePaddingBottom(orientation?: string) {
  let paddingBottom = 0
  if (Platform.OS === 'android') {
    return paddingBottom
  }
  const _orientation = orientation || getOrientation()
  if (isIphoneX() && _orientation.indexOf('PORTRAIT') >= 0) {
    paddingBottom = X_BOTTOM
  }
  return paddingBottom
}

const HEADER_HEIGHT = scaleSize(100)
const HEADER_HEIGHT_LANDSCAPE = scaleSize(60)
function getHeaderHeight(orientation?: string) {
  let height = HEADER_HEIGHT
  orientation = orientation || getOrientation()
  if (orientation.indexOf('LANDSCAPE') === 0) {
    height = HEADER_HEIGHT_LANDSCAPE
  }
  return height + getIphonePaddingTop(orientation)
}

export default {
  getScreenWidth,
  getScreenHeight,
  deviceWidth,
  deviceHeight,
  px2dp,
  dp2px,
  getIphonePaddingTop,
  getIphonePaddingBottom,
  getScreenSafeHeight,
  getScreenSafeWidth,
  setOrientation,
  getHeaderHeight,

  IOS_TOP,
  X_TOP,
  X_BOTTOM,
  X_BOTTOM_L,
  isIphoneX,
}
