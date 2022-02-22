/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Animated,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import Header, { HeaderProps } from '../Header'
import Loading, { Extra } from './Loading'
import { scaleSize ,screen} from '../../utils'
import { ConstNumber } from '../../constants'

import styles from './styles'

interface Props {
  style?: StyleProp<ViewStyle>, // 自定义内容样式
  headStyle?: StyleProp<ViewStyle>, // 头部自定义内容样式
  children: any, // Component自带属性，子组件
  header?: React.ReactNode, // 自定义导航栏
  bottomBar?: React.ReactNode, // 自定义底部栏
  withoutHeader?: boolean, // 设置没有导航栏
  headerProps?: HeaderProps, // 导航栏属性（参照Header.js）
  bottomProps?: {
    type?: 'fix',
    style?: StyleProp<ViewStyle>,
  }, // {type: 'fix'} 底部栏和内容是同一级的
  // 若不是fix，则底部栏是压盖在内容上的
  navigation: any, // react-navigation的导航
  initWithLoading?: boolean, // 初始化显示加载
  dialogInfo?: string, // 加载的文字
  scrollable?: boolean, // 内容是ScrollView或者View
  showFullInMap?: boolean, // 横屏时，地图上层界面是否显示半屏
  blankOpacity?: Number, // 横屏时，半屏遮罩透明度
  hideInBackground?: boolean, // 在mapview和map3d中,StackNavigator中有新页面时是否隐藏本页面
  orientation?: String, // redux中的实时横竖屏数据
  onOverlayPress?: () => {}, // 横屏时，半屏遮罩点击事件
  isOverlayBefore?: boolean, // 横屏是，遮罩的位置，true为左，反之为右
  device: Device,
}

interface State {
  top: Animated.Value,
  bottom: Animated.Value,
}

const AnimatedView = Animated.View

export default class Container extends Component<Props, State> {
  headerVisible: boolean
  bottomVisible: boolean
  overlayWidth: Animated.Value
  viewX: Animated.Value
  visible: boolean
  overlayCanClick: boolean
  containerHeader: Header | undefined | null
  loading: Loading | undefined | null

  static defaultProps = {
    orientation:
      Dimensions.get('screen').height > Dimensions.get('screen').width
        ? 'PORTRAIT'
        : 'LANDSCAPE',
    withoutHeader: false,
    sideMenu: false,
    initWithLoading: false,
    scrollable: false,
    showFullInMap: false, //是否在mapview和map3d中显示全屏页面，默认半屏
    blankOpacity: 0, //透明半屏的透明度
    hideInBackground: true, //在mapview和map3d中,StackNavigator中有新页面时是否隐藏本页面
    isOverlayBefore: false,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      top: new Animated.Value(0),
      bottom: new Animated.Value(0),
    }
    this.headerVisible = true
    this.bottomVisible = true
    this.overlayWidth = new Animated.Value(this.getCurrentOverlayWidth())
    this.viewX = new Animated.Value(0)
    this.visible = true
    this.overlayCanClick = true
  }

  setHeaderVisible = (visible: boolean, immediately = false) => {
    if (this.props.header) {
      if (this.headerVisible === visible) return
      Animated.timing(this.state.top, {
        toValue: visible ? 0 : scaleSize(-200),
        duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
      this.headerVisible = visible
    } else {
      this.containerHeader && this.containerHeader.setVisible(visible)
    }
  }

  setBottomVisible = (visible: boolean, immediately = false) => {
    // if (this.bottomVisible === visible) return
    Animated.timing(this.state.bottom, {
      toValue: visible ? 0 : scaleSize(-200),
      duration: immediately ? 0 : ConstNumber.ANIMATED_DURATION,
      useNativeDriver: false,
    }).start()
    this.bottomVisible = visible
  }

  componentDidMount() {
    this.props.initWithLoading && this.setLoading(true)
    this.addBackListener()
  }

  componentWillUnmount() {
    this.removeBackListener()
  }

  componentDidUpdate(prevProps: Props) {
    if (
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    ) {
      this.onOrientationChange()
    }
  }

  onOrientationChange = () => {
    // 解决横屏收起bottomView 竖屏显示 再次横屏bottomView不显示
    if(this.bottomVisible){
      this.setBottomVisible(true, true)
    }
    let width = this.getCurrentOverlayWidth()
    Animated.timing(this.overlayWidth, {
      toValue: width,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  getCurrentOverlayWidth = () => {
    let width
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      width = 40
    } else {
      width = 0
    }
    return width
  }

  addBackListener = () => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    }
  }

  removeBackListener = () => {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
    }
  }

  onBackPress = () => {
    let navigation =
      this.props.navigation ||
      (this.props.headerProps && this.props.headerProps.navigation)
    let backAction
    let headerProps = this.props.headerProps
    if (headerProps) {
      if (
        headerProps.backAction &&
        typeof headerProps.backAction === 'function'
      ) {
        backAction = headerProps.backAction
      }
    }
    if (backAction) {
      backAction()
      return true
    }
    if (navigation) {
      navigation.goBack(null)
      return true
    }
    return false
  }

  setLoading = (loading: boolean, info?: string, extra?: Extra) => {
    this.loading?.setLoading(loading, info, extra)
  }

  getAspectRation = () => {
    let height = Math.max(
      Dimensions.get('screen').height,
      Dimensions.get('screen').width,
    )
    let width = Math.min(
      Dimensions.get('screen').height,
      Dimensions.get('screen').width,
    )
    return height / width
  }

  onOverlayPress = () => {
    // 防止动画过程中重复点击
    if(this.overlayCanClick){
      this.overlayCanClick = false
    }else return

    if (this.props.onOverlayPress) {
      this.props.onOverlayPress()
    } else if (this.props.headerProps) {
      if (
        this.props.headerProps.backAction &&
        typeof this.props.headerProps.backAction === 'function'
      ) {
        this.props.headerProps.backAction()
      } else if (this.props.headerProps.navigation) {
        this.props.headerProps.navigation.goBack()
      }
    } else {
      this.props.navigation.native('MapView')
    }
  }

  renderHeader = (fixHeader?: boolean) => {
    return this.props.withoutHeader ? // ) //   <View /> // ) : ( //   <View style={styles.iOSPadding} /> // Platform.OS === 'ios' ? (
      null : this.props.header ? (
        <AnimatedView
          style={[fixHeader && styles.fixHeader, { top: this.state.top }]}
        >
          {this.props.header}
        </AnimatedView>
      ) : (
        <Header
          ref={ref => (this.containerHeader = ref)}
          navigation={this.props.navigation}
          {...this.props.headerProps}
          headStyle = {this.props.headStyle}
        />
      )
  }

  renderBottom = (fixBottom?: boolean) => {
    if (!this.props.bottomBar) return null
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    let style = []
    if (fixBottom) {
      if (isLandscape) {
        style.push(styles.fixRightBar)
      } else {
        style.push(styles.fixBottomBar)
      }
    } else {
      if (isLandscape) {
        style.push(styles.flexRightBar)
      } else {
        style.push(styles.flexBottomBar)
      }
    }
    // if (isLandscape && fixBottom) {
    //   style.push({ top: screen.getHeaderHeight() })
    // }
    if (this.props.bottomProps && this.props.bottomProps.style) {
      style.push(this.props.bottomProps.style)
    }
    let bottom = isLandscape
      ? { right: this.state.bottom, height: Platform.OS === 'android' ? screen.getScreenSafeHeight(this.props.device.orientation) :this.props.device.height }
      : { bottom: this.state.bottom, width: this.props.device.width }
    return (
      <AnimatedView style={[style, bottom]}>
        {this.props.bottomBar}
      </AnimatedView>
    )
  }

  render() {
    let ContainerView = this.props.scrollable ? ScrollView : View

    // 是否为flex布局的header
    let fixHeader =
      this.props.headerProps && this.props.headerProps.type === 'fix'
    let fixBottom =
      this.props.bottomProps && this.props.bottomProps.type === 'fix'
    let headerOnTop =
      (this.props.headerProps && this.props.headerProps.headerOnTop) || false
    let direction = {
      flexDirection:
        this.props.device.orientation.indexOf('LANDSCAPE') === 0
          ? 'row'
          : 'column',
    }
    let width
    width = this.overlayWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '1%'],
    })
    return (
      <AnimatedView
        style={[styles.view, { transform: [{ translateX: this.viewX }] }]}
      >
        {this.props.isOverlayBefore && (
          <AnimatedView style={{ width: width }}>
            <TouchableOpacity
              onPress={this.onOverlayPress}
              activeOpacity={this.props.blankOpacity}
              style={[styles.overlay, { opacity: this.props.blankOpacity }]}
            />
          </AnimatedView>
        )}
        <View style={{ flex: 1 }}>
          <StatusBar animated={true} hidden={false} />
          {headerOnTop && this.renderHeader(fixHeader)}
          <View style={[{ flex: 1, overflow: 'hidden' }, direction]}>
            <ContainerView style={[styles.container]}>
              <View style={[styles.container, this.props.style]}>
                {!headerOnTop && this.renderHeader(fixHeader)}
                {this.props.children}
              </View>
              {/*{fixBottom && this.renderBottom(fixBottom)}*/}
            </ContainerView>
            {this.renderBottom(fixBottom)}
          </View>
          <Loading
            ref={ref => (this.loading = ref)}
            info={this.props.dialogInfo}
            initLoading={this.props.initWithLoading}
          />
        </View>
        {!this.props.isOverlayBefore && (
          <AnimatedView style={{ width: width }}>
            <TouchableOpacity
              onPress={this.onOverlayPress}
              activeOpacity={this.props.blankOpacity}
              style={[styles.overlay, { opacity: this.props.blankOpacity }]}
            />
          </AnimatedView>
        )}
      </AnimatedView>
    )
  }
}
