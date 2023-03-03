/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated, ViewStyle } from 'react-native'
import { ImageButton } from '../../../../components'
import { ConstNumber } from '../../../../constants'
import { scaleSize, Toast, screen } from '../../../../utils'
import { getAssets } from '../../../../assets'
import { SMap } from 'imobile_for_reactnative'
import styles from './styles'

const DEFAULT_BOTTOM = scaleSize(135)
const DEFAULT_BOTTOM_LAND = scaleSize(26)
const DEFAULT_LEFT = scaleSize(34)

interface Props {
  style?: ViewStyle,
  compassStyle?: any,
  device: any,
  currentFloorID: number,
  bottomHeight?: any,
  selectLocation?: any,
  selectZoomIn?: any,
  selectZoomOut?: any,
}

interface State {
  left: Animated.Value,
  //在导航界面缩放时，bottom高度为scaleSize(240)避免mapController被遮盖
  bottom: Animated.Value,
  compass: Animated.Value,
  isGuiding: boolean,
}

export default class MapController extends React.Component<Props, State> {

  visible: boolean

  constructor(props: Props) {
    super(props)
    this.state = {
      left: new Animated.Value(DEFAULT_LEFT),
      //在导航界面缩放时，bottom高度为scaleSize(240)避免mapController被遮盖
      bottom: new Animated.Value(DEFAULT_BOTTOM_LAND),
      compass: new Animated.Value(0),
      isGuiding: false,
    }
    this.visible = true
  }

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.onOrientationChange()
    }
  }

  componentWillUnmount() {
  }

  onOrientationChange = () => {
    let animatedList = []
    let newBottom, newLeft
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      newBottom = DEFAULT_BOTTOM_LAND
    } else {
      newBottom = DEFAULT_BOTTOM
    }
    if (
      screen.isIphoneX() &&
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
    ) {
      newLeft = DEFAULT_LEFT
    }
    animatedList.push(
      Animated.timing(this.state.bottom, {
        toValue: newBottom,
        duration: 300,
        useNativeDriver: false,
      }),
    )
    newLeft !== undefined &&
      animatedList.push(
        Animated.timing(this.state.left, {
          toValue: newLeft,
          duration: 300,
          useNativeDriver: false,
        }),
      )
    Animated.sequence(animatedList).start()
  }
  
  /**
   * 改变bottom位置 导航路径界面使用
   * @param isBottom
   */
  changeBottom = (isBottom: boolean) => {
    let value = isBottom ? scaleSize(240) : DEFAULT_BOTTOM
    Animated.timing(this.state.bottom, {
      toValue: value,
      duration: ConstNumber.ANIMATED_DURATION,
      useNativeDriver: false,
    }).start()
  }

  setVisible = (visible: boolean, immediately = false) => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: DEFAULT_LEFT,
        duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    }
  }

  // 归位
  reset = (immediately = false) => {
    let animatedList = []
    let bottom =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? DEFAULT_BOTTOM_LAND
        : DEFAULT_BOTTOM
    if (this.state.bottom._value !== bottom) {
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: bottom,
          duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
    }
    if (this.state.left._value !== DEFAULT_LEFT) {
      animatedList.push(
        Animated.timing(this.state.left, {
          toValue: DEFAULT_LEFT,
          duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
    }
    Animated.sequence(animatedList).start()
  }

  // 移动
  move = (position: { bottom?: number | 'default', left?: number | 'default' }, immediately = false) => {
    let animatedList = []
    if (position.bottom !== undefined) {
      let _bottom = this.state.bottom._value + position.bottom
      if (position.bottom === 'default') _bottom = DEFAULT_BOTTOM
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: _bottom,
          duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
    }
    if (position.left !== undefined) {
      let _left = this.state.left._value + position.left
      if (position.left === 'default') _left = DEFAULT_LEFT
      animatedList.push(
        Animated.timing(this.state.left, {
          toValue: _left,
          duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
          useNativeDriver: false,
        }),
      )
    }
    Animated.sequence(animatedList).start()
  }

  plus = () => {
    if(this.props.selectZoomIn){
      this.props.selectZoomIn()
      return
    }
    SMap.zoom(2)
  }

  minus = () => {
    if(this.props.selectZoomOut){
      this.props.selectZoomOut()
      return
    }
    SMap.zoom(0.5)
  }

  location = async () => {
    if(this.props.selectLocation){
      this.props.selectLocation()
      return
    }

    SMap.moveToCurrent().then(result => {
      !result &&
        Toast.show('不在地图范围内')
    })
  }

  renderLocation = () => {
    return (
      <ImageButton
        style={[styles.btn, styles.separator, styles.shadow]}
        imageStyle={styles.btnImg}
        key={'controller_location'}
        textColor={'black'}
        size={ImageButton.Size.NORMAL}
        image={getAssets().mapTools.icon_location}
        onPress={this.location}
      />
    )
  }

  render() {
    if (this.props.currentFloorID) return null
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.style,
          { left: this.state.left },
          { bottom: this.state.bottom },
          this.props.bottomHeight&&{ bottom: this.props.bottomHeight},
        ]}
      >
        <View style={[styles.topView, styles.shadow]}>
          <ImageButton
            style={styles.btn}
            imageStyle={styles.btnImg}
            key={'controller_plus'}
            textColor={'black'}
            size={ImageButton.Size.NORMAL}
            image={getAssets().mapTools.icon_enlarge}
            onPress={this.plus}
          />
          <ImageButton
            style={styles.btn}
            imageStyle={styles.btnImg}
            key={'controller_minus'}
            textColor={'black'}
            size={ImageButton.Size.NORMAL}
            image={getAssets().mapTools.icon_narrow}
            onPress={this.minus}
          />
        </View>
        {this.renderLocation()}
      </Animated.View>
    )
  }
}
