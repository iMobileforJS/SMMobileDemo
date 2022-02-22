/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { Text, View, Image, TouchableOpacity, GestureResponderEvent } from 'react-native'
import styles from './styles'
import { scaleSize } from '../../utils'
import { getAssets } from '../../assets'

interface Props {
  style?: any,
  darkBackBtn?: boolean,
  count?: number,
  activeOpacity?: number,
  image?: any,
  imageStyle?: any,
  /** 返回一个值用来判断方法何时执行完毕 */
  onPress: (event: GestureResponderEvent) => any,
}

class BackButton extends PureComponent<Props> {

  static defaultProps = {
    image: getAssets().nav.icon_back,
  }

  /** 执行返回方法时防止重复点击 */
  inAction: boolean = false

  onPress = (event: GestureResponderEvent) => {
    if(this.props.onPress) {
      if(!this.inAction) {
        this.inAction = true
        const value = this.props.onPress(event)
        Promise.resolve(value).then(() => {
          this.inAction = false
        }).catch(() => {
          this.inAction = false
        })
      }
    }
  }

  render() {
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={'返回'}
        style={[{
          width: scaleSize(80),
          height: scaleSize(80),
          justifyContent: 'center',
          alignContent: 'center',
        }, this.props.style]}
        activeOpacity={this.props.activeOpacity}
        onPress={this.onPress}
      >
        {this.props.count ? <Text style={styles.count}>({this.props.count})</Text> : null}
        <View
          style={[styles.iconBtnBg, this.props.darkBackBtn && styles.iconBtnBgDarkColor]}
        >
          <Image
            source={this.props.image}
            style={[styles.backIcon, this.props.imageStyle]}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

export default BackButton
