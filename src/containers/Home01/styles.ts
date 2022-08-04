/**
 * 二级根页面的样式文件
 */
 import { StyleSheet } from 'react-native'
 import { scaleSize } from '@/utils'
 import { color } from '@/styles'
 
 export default StyleSheet.create({
   container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingTop: scaleSize(20),
   },
   Btn: {
    width: '100%',
    height: scaleSize(60),
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scaleSize(15),
   },
   BtnText: {
    color: '#fff',
   }
 })
 