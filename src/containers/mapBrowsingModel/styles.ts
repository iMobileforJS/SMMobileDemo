/**
 * 地图浏览的样式文件
 */
import { StyleSheet } from 'react-native'
import { scaleSize } from '@/utils'
import { color } from '@/styles'

export default StyleSheet.create({
  buttons: {
    position: 'absolute',
    right: scaleSize(34),
    top: scaleSize(143),
    width: scaleSize(80),
    paddingVertical: scaleSize(20),
    flexDirection: 'column',
    backgroundColor: color.white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightBottomButtons: {
    position: 'absolute',
    right: scaleSize(34),
    bottom: scaleSize(26),
    width: scaleSize(60),
    paddingVertical: scaleSize(10),
    flexDirection: 'column',
    backgroundColor: color.white,
    borderRadius: scaleSize(10),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
