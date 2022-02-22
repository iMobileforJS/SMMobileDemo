import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    left: scaleSize(34),
    bottom: scaleSize(135),
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  topView: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: scaleSize(8),
    width: scaleSize(64),
    height: scaleSize(64),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnImg: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  compass: {
    borderRadius: scaleSize(8),
  },
  separator: {
    marginTop: scaleSize(30),
  },
  compassView: {
    width: scaleSize(64),
    height: scaleSize(64),
    borderRadius: scaleSize(8),
    backgroundColor: 'white',
    marginTop: scaleSize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
})
