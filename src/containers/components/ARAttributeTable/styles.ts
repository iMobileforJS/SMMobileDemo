
import { dp } from '@/utils'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: dp(220),
    height: dp(150),
    top: dp(100),
    left: dp(10),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    // borderColor: '#007AFF' ,
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: dp(1),
    borderRadius: dp(10),
    overflow: 'hidden',
  },
  textStyle: {
    // color: '#fff',
    color: '#000',
    fontSize: dp(12),
    textAlign: "left",
    justifyContent: 'center',
    paddingLeft: dp(8),
  },
  row: {
    width: dp(220),
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  colLeft: {
    flex: 2,
    minHeight: dp(30),
    borderColor: 'rgba(255, 255, 255, .1)',
    // backgroundColor: 'rgba(0, 45, 99, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, .8)',
    paddingHorizontal: dp(3),
    borderWidth: dp(1),
    justifyContent: 'center',
    alignContent: 'flex-start',
    marginTop: -dp(1),
    marginLeft: -dp(1),
  },
  colRight: {
    flex: 3,
    minHeight: dp(30),
    borderColor: 'rgba(255, 255, 255, .1)',
    // backgroundColor: 'rgba(0, 45, 99, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, .7)',
    borderWidth: dp(1),
    paddingHorizontal: dp(3),
    justifyContent: 'center',
    alignContent: 'flex-start',
    marginTop: -dp(1),
    marginLeft: -dp(1),
  }
})

export default styles
