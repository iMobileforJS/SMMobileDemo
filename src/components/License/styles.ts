/** 许可申请面板样式文档 */
import { StyleSheet, Platform } from 'react-native'
import { color, size } from '@/styles'
import { scaleSize } from '@/utils'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // width: '100%',
    // height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // background: '#000',
    shadowColor: '#000',
    shadowRadius: scaleSize(20),
    shadowOffset: {
      width: scaleSize(10),
      height: scaleSize(10),
    },
  },
  mask:{
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    position: 'absolute',
    width: scaleSize(400),
    height: scaleSize(400),
    backgroundColor: '#fff',
    borderRadius: scaleSize(20),
    shadowColor: '#000',
    shadowRadius: scaleSize(20),
    shadowOffset: {
      width: scaleSize(10),
      height: scaleSize(10),
    },
  },
  titleView: {
    width: '100%',
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#666',
    borderBottomWidth: scaleSize(1),
  },
  titleContent: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContentLeft: {
    borderTopLeftRadius: scaleSize(20),
  },
  titleContentRight: {
    borderTopRightRadius: scaleSize(20),
  },
  titlecontentSelected: {
    backgroundColor: '#000',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: scaleSize(24),
    // backgroundColor: '#fff',
    color: '#333',
    textAlignVertical: 'center',
  },
  titleSelected: {
    color: '#fff',
  },

  // 云许可部分
  cloudView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomLeftRadius: scaleSize(20),
    borderBottomRightRadius: scaleSize(20),
    paddingTop: scaleSize(10),
  },
  cloudInputContainer: {
    width: '80%',
    height: scaleSize(60),
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: scaleSize(30),
    marginVertical: scaleSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloudInput: {
    flex: 1,
    height: scaleSize(60),
    paddingVertical: scaleSize(5),
    paddingHorizontal: scaleSize(10),
    backgroundColor: '#f3f3f3',
    borderRadius: scaleSize(30),
    textAlign: 'center',
  },
  cloudButton: {
    width: '80%',
    height: scaleSize(60),
    backgroundColor: '#000',
    marginVertical: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(10),
  },
  cloudButtonText: {
    color: '#fff',
    textAlignVertical: 'center',
  },

  // 离线许可部分

  offlineView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomLeftRadius: scaleSize(20),
    borderBottomRightRadius: scaleSize(20),
    paddingTop: scaleSize(20),
  },
  offlineInputContainer: {
    width: '90%',
    height: scaleSize(60),
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: scaleSize(30),
    marginVertical: scaleSize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineInput: {
    flex: 1,
    height: scaleSize(60),
    paddingVertical: scaleSize(5),
    paddingHorizontal: scaleSize(10),
    backgroundColor: '#f3f3f3',
    borderRadius: scaleSize(30),
    textAlign: 'center',
  },
  // 清空按钮
  clearBtn: {
    width: scaleSize(52),
    height: scaleSize(52),
    paddingRight: scaleSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  clearImg: {
    width: scaleSize(52),
    height: scaleSize(52),
  },

  // 关闭按钮
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: -scaleSize(45),
    backgroundColor: '#fff',
    padding: scaleSize(5),
    borderRadius: scaleSize(20),
  },
  closeBtnImg: {
    width: scaleSize(30),
    height: scaleSize(30),
  },
})
