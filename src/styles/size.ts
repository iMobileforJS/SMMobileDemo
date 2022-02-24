import { Dimensions } from 'react-native'
import { setSpText, scaleSize, screen as s } from '../utils'

const screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  statusBarHeight: s.getIphonePaddingTop(),
}

const fontSize = {
  fontSizeXXXl: setSpText(30),
  fontSizeXXl: setSpText(28),
  fontSizeXl: setSpText(26),
  fontSizeLg: setSpText(24),
  fontSizeMd: setSpText(22),
  fontSizeSm: setSpText(20),
  fontSizeXs: setSpText(18),
}

const imageSize = {
  small: scaleSize(30),
  middle: scaleSize(44),
  large: scaleSize(52),
}

const layoutSize = {
  horizonWidth: 15,
  verticalHeight: 15,
}
export default {
  screen,
  fontSize,
  imageSize,
  layoutSize,
}
