/** 地图导航界面的样式文件 */
import { StyleSheet } from 'react-native'
import { scaleSize } from '@/utils'
import { color } from '@/styles'

export default StyleSheet.create({
  buttons: {
    position: 'absolute',
    right: scaleSize(34),
    top: scaleSize(150),
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
})
