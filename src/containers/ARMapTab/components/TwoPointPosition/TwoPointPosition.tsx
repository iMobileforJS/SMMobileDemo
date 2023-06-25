/** 两点定位校准页面 */
import { FileTools, SARMap, AppInfo, SMap } from 'imobile_for_reactnative'
import React from 'react'
import { Image, Platform, Text, TextInput, View, TouchableOpacity, EmitterSubscription, Dimensions, Keyboard, ImageRequireSource, NativeSyntheticEvent, NativeTouchEvent } from 'react-native'
import ContainerType from '@/components/Container/Container'
import { scaleSize, Toast } from '@/utils'
import { getAssets } from '@/assets'
import { Vector3 } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import { ARAction, ARTrackingMarkerType, TwoPointPositionParamType } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import styles from './styles'

interface Props {
  // 横竖屏切换的相关数据
  device: Device,
  close: () => void,
}

interface State {
  /** 定位点1的经度 */
  x: string
  /** 定位点1的纬度 */
  y: string
  /** 定位点1的高程 */
  z: string
  xClearHiden: boolean
  yClearHiden: boolean
  zClearHiden: boolean
  /** 定位点2的经度 */
  p2x: string
  /** 定位点2的纬度 */
  p2y: string
  /** 定位点2的高程 */
  p2z: string
  p2xClearHiden: boolean
  p2yClearHiden: boolean
  p2zClearHiden: boolean

  /** AR点1 */
  anchorARPoint1: Vector3 | null
  /** AR点2 */
  anchorARPoint2: Vector3 | null

  /** 提示是否显示 */
  isTipsShow: boolean
  /** 当前正在添加的点标识 */
  curAddPoint: 'p1' | 'p2'

  /** 键盘出来后，输入框与键盘的高度差 */
  diff: number
}

export default class TwoPointPosition extends React.Component<Props, State> {
  container: ContainerType | undefined | null

  path: string = ""
  keyboardDidShowListener: EmitterSubscription | null = null
  keyboardDidHideListener: EmitterSubscription | null = null
  pageY: number = 0

  constructor(props: Props) {
    super(props)
    this.state = {
      x: '0',
      y: '0',
      z: '0',
      xClearHiden: true,
      yClearHiden: true,
      zClearHiden: true,
      p2x: '0',
      p2y: '0',
      p2z: '0',
      p2xClearHiden: true,
      p2yClearHiden: true,
      p2zClearHiden: true,
      anchorARPoint1: null,
      anchorARPoint2: null,
      isTipsShow: true,
      curAddPoint: 'p1',
      diff: 0,
    }
  }

  async componentDidMount() {

    const homePath = await FileTools.getHomeDirectory()
    const apppath = await AppInfo.getRootPath()
    const userName = await AppInfo.getUserName()
    this.path = homePath + apppath + "/User/" + userName + "/Data/Temp"

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
      this._keyboardDidShow.bind(this))
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
      this._keyboardDidHide.bind(this))

    // 开启两点定位 
    await SARMap.setAction(ARAction.LineDot_CREATE_FOUCUS)
  }

  _keyboardDidShow(e: any) { // 类型未知
    if (Platform.OS === 'ios') {
      const ScHeight = Dimensions.get('window').height
      // 键盘以上的位置的高度
      // console.warn(ScHeight + " - " + e.endCoordinates.height + " - " + this.pageY)
      const diff = this.pageY - (ScHeight - e.endCoordinates.height)

      if (diff > 0) {
        this.setState({
          diff: diff + scaleSize(36),
        })
      }
    }
  }

  _keyboardDidHide() {
    this.setState({
      diff: 0,
    })
  }

  /** 打点按钮的点击响应方法 */
  addPointBtnAction = async () => {
    if (this.state.curAddPoint === 'p1') {
      this.selectAnchorOne()
    } else {
      this.selectAnchorTwo()
    }
  }

  /** 定位点一的点击方法 */
  selectAnchorOne = async () => {
    const arPoint1 = await SARMap.getFocusPosition()
    const result = await SMap.getCurrentLocation()
    if (result && arPoint1 && JSON.stringify(arPoint1) !== "{}") {
      const modelPath = this.path + "/FirstPoint.glb"
      const info: Pick<SARMap.Transform, "position" | 'scale'> = {
        position: arPoint1,
        scale: {
          x: 1,
          y: 1,
          z: 1,
        },
      }
      // await SARMap.addTrackingMarker(this.path + "/icon_ar_point01.png", info, 'point1', ARTrackingMarkerType.IMAGE)
      await SARMap.addTrackingMarker(modelPath, info, 'point1', ARTrackingMarkerType.MODEL)
      await SARMap.addDotLinePoint(arPoint1)
      this.setState({
        anchorARPoint1: arPoint1,
        x: result.longitude + '',
        y: result.latitude + '',
        curAddPoint: 'p2',
        isTipsShow: true,
      })
    }

  }

  /** 定位点二的点击方法 */
  selectAnchorTwo = async () => {
    if (!this.state.anchorARPoint2) {
      const arPoint2 = await SARMap.getFocusPosition()
      const result = await SMap.getCurrentLocation()

      if (result && arPoint2 && JSON.stringify(arPoint2) !== "{}") {
        const modelPath = this.path + "/SecondPoint.glb"
        const info: Pick<SARMap.Transform, "position" | 'scale'> = {
          position: arPoint2,
          scale: {
            x: 1,
            y: 1,
            z: 1,
          },
        }
        await SARMap.addTrackingMarker(modelPath, info, 'point2', ARTrackingMarkerType.MODEL)
        await SARMap.addDotLinePoint(arPoint2)
        this.setState({
          anchorARPoint2: arPoint2,
          p2x: result.longitude + '',
          p2y: result.latitude + '',
        })
      }
    }


  }


  /** 字符类型转数字的工具方法 */
  stringToNumber = (text: string): number => {
    let number = Number(text)
    if (isNaN(number)) {
      number = 0
    }
    return number
  }

  /** 两点定位界面的校准按钮响应方法 */
  submitAction = async () => {

    if (this.state.anchorARPoint1 && this.state.anchorARPoint2) {
      // 两点定位角校准参数
      const param: TwoPointPositionParamType = {
        gpsPnt1: {
          x: this.stringToNumber(this.state.x),
          y: this.stringToNumber(this.state.y),
        },
        gpsPnt2: {
          x: this.stringToNumber(this.state.p2x),
          y: this.stringToNumber(this.state.p2y),
        },
        arPnt1: this.state.anchorARPoint1,
        arPnt2: this.state.anchorARPoint2,
        height: this.stringToNumber(this.state.z),
      }
      // 两点定位角校准
      const result = await SARMap.twoPointPosition(param)
      if (result) {
        // await this.clear()
        // 关闭两点定位和清除已添加的线
        await SARMap.setAction(ARAction.NULL)
        // 清除已添加到实景中的所有图片
        await SARMap.removeAllTrackingMarker()
        this.props.close?.()
        Toast.show('校准成功')
      } else {
        Toast.show('校准失败')
      }
    } else {
      Toast.show('定位点不足两个，请继续添加定位点')
    }

  }

  /** 清除按钮响应方法 */
  clear = async () => {
    // 关闭两点定位和清除已添加的线
    await SARMap.setAction(ARAction.NULL)
    // 清除已添加到实景中的所有图片
    await SARMap.removeAllTrackingMarker()
    this.setState({
      x: '0',
      y: '0',
      z: '0',
      p2x: '0',
      p2y: '0',
      p2z: '0',
      anchorARPoint1: null,
      anchorARPoint2: null,
      curAddPoint: 'p1',
    })
    // 100毫秒后重新启动两点定位
    const reStartTimer = setTimeout(async () => {
        // 开启两点定位 
        await SARMap.setAction(ARAction.LineDot_CREATE_FOUCUS)
      clearTimeout(reStartTimer)
    }, 100)
  }

  /** 添加按钮 */
  renderAddPointBtn = () => {
    return (
      <TouchableOpacity
        style={[styles.btnStyle, {
          position: 'absolute',
          // bottom: scaleSize(100),
          // right: scaleSize(220),
          top: scaleSize(170),
          right: scaleSize(20),
        }]}
        onPress={this.addPointBtnAction}
      >
        <Text>{'打点'}</Text>
      </TouchableOpacity>

    )
  }

  /** 清除按钮 */
  renderClearBtn = () => {
    return (
      <TouchableOpacity
        style={[styles.btnStyle, {
          position: 'absolute',
          top: scaleSize(240),
          right: scaleSize(20),
        }]}
        onPress={this.clear}
      >
        <Text>{'清除'}</Text>
      </TouchableOpacity>
    )
  }

  /** 校准按钮 */
  renderSubmitBtn = () => {
    return (
      <TouchableOpacity
        style={[styles.btnStyle, {
          position: 'absolute',
          top: scaleSize(310),
          right: scaleSize(20),
        }]}
        onPress={this.submitAction}
      >
        <Text>{'校准'}</Text>
      </TouchableOpacity>
    )
  }


  /** 字符串类型型浮点数字格式化 */
  formatFloat(value: string): string {
    value = value.replace(/[^[\d-]\d.]/g, '') //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
    value = value
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
    // value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    if (value.indexOf('.') < 0 && value != '') {
      //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      return parseFloat(value) + ''
    } else if (value == '') {
      return '0'
    }
    return value
  }


  /** 输入框组件 */
  renderInput = (props: {
    image: ImageRequireSource,
    text: string,
    value: string,
    isHidenBottomLine?: boolean,  // true不显示  false显示
    onChange: (text: string) => void
    onFocus?: () => void
    onBlur?: () => void
  }) => {
    return (
      <View style={styles.inputItem}>
        <Image
          source={props.image}
          style={[{
            width: scaleSize(40),
            height: scaleSize(40),
            marginRight: scaleSize(5),
          }]}
        />
        <Text style={[{
          marginRight: scaleSize(18),
          fontSize: scaleSize(20),
          color: '#000',
        }]}>
          {props.text}
        </Text>
        <TextInput
          style={[{
            flex: 1,
            fontSize: scaleSize(20),
            padding: 0,
            height: scaleSize(39),
            borderBottomWidth: scaleSize(1),
            borderBottomColor: 'transparent',

          },
          !props.isHidenBottomLine && {
            borderBottomColor: '#ECECEC',
          },]}
          keyboardType={'numeric'}
          returnKeyType={'done'}
          defaultValue={props.value}
          value={props.value}
          onChangeText={(text: string) => {
            if (text !== '' && text !== '-') {
              text = this.formatFloat(text)
            }
            props.onChange(text)
          }}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onPressIn={(e: NativeSyntheticEvent<NativeTouchEvent>) => {
            const event = e.nativeEvent
            // console.warn('locationX: ' + event.locationX + "\nlocationY: " + event.locationY + "\npageX: " + event.pageX + "\npageY: " + event.pageY)
            this.pageY = event.pageY
          }}
        />

      </View>
    )
  }



  /** 定位信息面板 */
  renderInputs = () => {
    return (
      <View
        style={[{
          width: '100%',
          height: scaleSize(480),
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: scaleSize(20) + this.state.diff,
          left: 0,
          paddingVertical: scaleSize(10),
        }]}
      >

        {/* 定位点1的定位信息 */}
        <View
          style={[{
            width: '100%',
            flex: 1,
          }]}
        >
          <View>
            <Text>{'定位点1'}</Text>
          </View>
          {/* x */}
          <View
            style={[styles.inputRowView]}
          >
            <View
              style={[styles.inputRowViewLeft]}
            >
              <Text
                style={[styles.inputRowViewLeftTitle]}
              >{'x:'}</Text>
              <Text
                style={[styles.inputRowViewLeftValue]}
              >{this.state.anchorARPoint1?.x || 0}</Text>
            </View>
            <View
              style={[styles.inputRowViewRight]}
            >
              {
                this.renderInput({
                  image: getAssets().twoPointPosition.icon_lines,
                  text: '经度:',
                  value: this.state.x,
                  onChange: text => {
                    this.setState({ x: text })
                  },
                  onFocus: () => {
                    // 获取焦点 显示
                    this.setState({
                      xClearHiden: false,
                    })
                  },
                  onBlur: () => {
                    // 失去焦点 隐藏
                    this.setState({
                      xClearHiden: true,
                    })
                  },
                })
              }
            </View>
          </View>
          {/* y */}
          <View
            style={[styles.inputRowView]}
          >
            <View
              style={[styles.inputRowViewLeft]}
            >
              <Text
                style={[styles.inputRowViewLeftTitle]}
              >{'y:'}</Text>
              <Text
                style={[styles.inputRowViewLeftValue]}
              >{this.state.anchorARPoint1?.y || 0}</Text>
            </View>
            <View
              style={[styles.inputRowViewRight]}
            >
              {
                this.renderInput({
                  image: getAssets().twoPointPosition.icon_latitudes,
                  text: '纬度:',
                  value: this.state.y,
                  onChange: text => {
                    this.setState({ y: text })
                  },
                  onFocus: () => {
                    // 获取焦点 显示
                    this.setState({
                      yClearHiden: false,
                    })
                  },
                  onBlur: () => {
                    // 失去焦点 隐藏
                    this.setState({
                      yClearHiden: true,
                    })
                  },
                })
              }
            </View>

          </View>

          {/* z */}
          <View
            style={[styles.inputRowView]}
          >
            <View
              style={[styles.inputRowViewLeft]}
            >
              <Text
                style={[styles.inputRowViewLeftTitle]}
              >{'z:'}</Text>
              <Text
                style={[styles.inputRowViewLeftValue]}
              >{this.state.anchorARPoint1?.z || 0}</Text>
            </View>
            <View
              style={[styles.inputRowViewRight]}
            >
              {
                this.renderInput({
                  image: getAssets().twoPointPosition.icon_height,
                  text: '高程:',
                  value: this.state.z,
                  isHidenBottomLine: true,
                  onChange: text => {
                    this.setState({ z: text })
                  },
                  onFocus: () => {
                    // 获取焦点 显示
                    this.setState({
                      zClearHiden: false,
                    })
                  },
                  onBlur: () => {
                    // 失去焦点 隐藏
                    this.setState({
                      zClearHiden: true,
                    })
                  },
                })
              }
            </View>

          </View>
        </View>

        {/* 定位点2的定位信息 */}
        <View
          style={[{
            width: '100%',
            flex: 1,
          }]}
        >
          <View>
            <Text>{'定位点2'}</Text>
          </View>
          {/* p2 x */}
          <View
            style={[styles.inputRowView]}
          >
            <View
              style={[styles.inputRowViewLeft]}
            >
              <Text
                style={[styles.inputRowViewLeftTitle]}
              >{'x:'}</Text>
              <Text
                style={[styles.inputRowViewLeftValue]}
              >{this.state.anchorARPoint2?.x || 0}</Text>
            </View>
            <View
              style={[styles.inputRowViewRight]}
            >
              {
                this.renderInput({
                  image: getAssets().twoPointPosition.icon_lines,
                  text: '经度:',
                  value: this.state.p2x,
                  onChange: text => {
                    this.setState({ p2x: text })
                  },
                  onFocus: () => {
                    // 获取焦点 显示
                    this.setState({
                      p2xClearHiden: false,
                    })
                  },
                  onBlur: () => {
                    // 失去焦点 隐藏
                    this.setState({
                      p2xClearHiden: true,
                    })
                  },
                })
              }
            </View>
          </View>
          {/* p2 y */}
          <View
            style={[styles.inputRowView]}
          >
            <View
              style={[styles.inputRowViewLeft]}
            >
              <Text
                style={[styles.inputRowViewLeftTitle]}
              >{'y:'}</Text>
              <Text
                style={[styles.inputRowViewLeftValue]}
              >{this.state.anchorARPoint2?.y || 0}</Text>
            </View>
            <View
              style={[styles.inputRowViewRight]}
            >
              {
                this.renderInput({
                  image: getAssets().twoPointPosition.icon_latitudes,
                  text: '纬度:',
                  value: this.state.p2y,
                  onChange: text => {
                    this.setState({ p2y: text })
                  },
                  onFocus: () => {
                    // 获取焦点 显示
                    this.setState({
                      p2yClearHiden: false,
                    })
                  },
                  onBlur: () => {
                    // 失去焦点 隐藏
                    this.setState({
                      p2yClearHiden: true,
                    })
                  },
                })
              }
            </View>

          </View>

          {/* p2 z */}
          <View
            style={[styles.inputRowView]}
          >
            <View
              style={[styles.inputRowViewLeft]}
            >
              <Text
                style={[styles.inputRowViewLeftTitle]}
              >{'z:'}</Text>
              <Text
                style={[styles.inputRowViewLeftValue]}
              >{this.state.anchorARPoint2?.z || 0}</Text>
            </View>
            <View
              style={[styles.inputRowViewRight]}
            >
              {
                this.renderInput({
                  image: getAssets().twoPointPosition.icon_height,
                  text: '高程:',
                  value: this.state.p2z,
                  isHidenBottomLine: true,
                  onChange: text => {
                    this.setState({ p2z: text })
                  },
                  onFocus: () => {
                    // 获取焦点 显示
                    this.setState({
                      p2zClearHiden: false,
                    })
                  },
                  onBlur: () => {
                    // 失去焦点 隐藏
                    this.setState({
                      p2zClearHiden: true,
                    })
                  },
                })
              }
            </View>

          </View>
        </View>


      </View>
    )
  }



  /** 两点定位的可操作内容 */
  renderContainer = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255,255,255,.2)'
        }]}
      >
        {this.renderAddPointBtn()}
        {this.renderSubmitBtn()}
        {this.renderClearBtn()}
        {this.renderInputs()}
      </View>
    )
  }

  render() {
    return (
      this.renderContainer()
    )
  }
}