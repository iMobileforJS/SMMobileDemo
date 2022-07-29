/*
  Copyright © SuperMap. All rights reserved.
  Author: Yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  TextStyle,
  TextPropTypes,
  ImageStyle,
  GestureResponderEvent,
} from 'react-native'
import { scaleSize } from '@/utils'
import { size } from '@/styles'

interface Props {
  image: any, // 未点击时图片
  selectedImage?: any, // 点击时图片
  size?: string, // 图片文字大小
  title?: string, // 文字
  onPress: (e: GestureResponderEvent) => void, // 点击事件
  textStyle?: TextStyle, // 自定义文字样式
  textColor?: string, // 自定义文字颜色
  imageStyle?: ImageStyle, // 自定义图片样式
  style?: ViewStyle, // 自定义按钮样式
  selected?: boolean, // 是否被选中
  selectMode?: string, // normal: 选择 | 非选择状态
  // flash：按下和松开
  activeOpacity?: number, // 点击按钮透明度 0 - 1
  separator?: number, // 图片和文字的间距
  onPressIn?: () => void, // 按下时的事件
  onPressOut?: () => void, // 松开时的事件
  opacity?: number, // 点击后透明度，若无，在为TouchableHighlight，反之为TouchableOpacity
  textProps?: typeof TextPropTypes, // 文字属性
}

interface State {
  selected: boolean,
}

export default class ImageButton extends React.Component<Props, State> {

  clickAble: boolean // 防止重复点击
  mtBtn: TouchableOpacity | undefined | null

  static defaultProps = {
    activeOpacity: 1,
    size: 'normal',
    selected: false,
    selectMode: 'normal', // normal: 选择 | 非选择状态     ---    flash：按下和松开
  }
  static Size: { LARGE: string; NORMAL: string; SMALL: string }

  constructor(props: Props) {
    super(props)
    this.state = {
      selected: props.selected || false,
    }
    this.clickAble = true
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  action = (e: GestureResponderEvent) => {
    if (this.props.selectMode === 'flash') return
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 100)
      this.props.onPress && this.props.onPress(e)
    }
  }

  _onPressOut = (e: GestureResponderEvent) => {
    if (this.props.onPressOut) {
      this.props.onPressOut()
      return
    }
    if (this.props.selectMode === 'normal') return
    this.setState(
      {
        selected: false,
      },
      () => {
        this.props.onPress && this.props.onPress(e)
      },
    )
  }

  _onPressIn = () => {
    if (this.props.onPressIn) {
      this.props.onPressIn()
      return
    }
    if (this.props.selectMode === 'normal') return
    this.setState({
      selected: true,
    })
  }

  setNativeProps = (props: ViewStyle) => {
    this.mtBtn && this.mtBtn.setNativeProps(props)
  }

  render() {
    let imageStyle, textStyle: TextStyle

    switch (this.props.size) {
      case 'small':
        imageStyle = styles.smallImage
        textStyle = styles.smallText
        break
      case 'large':
        imageStyle = styles.largeImage
        textStyle = styles.largeText
        break
      default:
        imageStyle = styles.normalImage
        textStyle = styles.normalText
        break
    }

    let image
    if (this.props.selectMode === 'flash' && this.props.selectedImage) {
      image = this.state.selected ? this.props.selectedImage : this.props.image
    } else if (this.props.selectedImage) {
      image = this.props.selected ? this.props.selectedImage : this.props.image
    } else {
      image = this.props.image
    }

    return (
      <TouchableOpacity
        ref={ref => (this.mtBtn = ref)}
        accessible={true}
        activeOpacity={this.props.activeOpacity}
        accessibilityLabel={this.props.title}
        onPress={this.action}
        style={[styles.container, this.props.style]}
        onPressOut={this._onPressOut}
        onPressIn={this._onPressIn}
      >
        <View style={styles.container}>
          {image && (
            <Image
              resizeMode={'contain'}
              style={[imageStyle, this.props.imageStyle]}
              source={image}
            />
          )}
          {this.props.title && (
            <Text
              style={[
                { marginTop: scaleSize(5) },
                textStyle,
                this.props.textStyle,
                this.props.textColor && { color: this.props.textColor },
                this.props.separator && { marginTop: this.props.separator },
              ]}
              {...this.props.textProps}
            >
              {this.props.title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

ImageButton.Size = {
  LARGE: 'large',
  NORMAL: 'normal',
  SMALL: 'small',
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  largeImage: {
    height: scaleSize(45),
    width: scaleSize(45),
  },
  normalImage: {
    height: scaleSize(50),
    width: scaleSize(50),
  },
  smallImage: {
    height: scaleSize(45),
    width: scaleSize(45),
  },
  largeText: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  normalText: {
    fontSize: scaleSize(20),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  smallText: {
    fontSize: size.fontSize.fontSizeXs,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})
