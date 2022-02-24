/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, TextInput, Image, TouchableOpacity, ReturnKeyTypeOptions } from 'react-native'
import { getAssets } from '@/assets'
import { color } from '@/styles'
import styles from './styles'

interface Props {
  onBlur?: (value: string) => void, // 失去焦点事件
  onFocus?: (value: string) => void, // 获得焦点事件
  onClear?: () => void, // 清除文字
  onSubmitEditing?: (value: string) => void, // 提交

  style?: any, // 自定义内容样式
  defaultValue?: string, // 默认值
  editable?: boolean, // 是否可编辑
  placeholder?: string, // 占位符
  placeholderTextColor?: string, // 占位符颜色
  isFocused?: boolean, // 是否获得焦点
  keyboardAppearance?: "default" | "light" | "dark" | undefined, // 键盘样式
  returnKeyType?: ReturnKeyTypeOptions | undefined, // Android上确定按钮文字
  returnKeyLabel?: string, // 键盘返回按钮文字
  blurOnSubmit?: boolean | undefined, // 是否提交失去焦点
}

interface State {
  isFocused: boolean,
  value: string,
}

export default class SearchBar extends PureComponent<Props, State> {

  searchInput: TextInput | null | undefined

  static defaultProps = {
    isFocused: false,
    keyboardAppearance: 'default',
    returnKeyType: 'search',
    returnKeyLabel: '搜索',
    blurOnSubmit: true,
    placeholderTextColor: color.fontColorGray,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      isFocused: props.isFocused || false,
      value: props.defaultValue || '',
    }
  }

  focus = () => {
    this.searchInput && this.searchInput.focus()
  }

  blur = () => {
    this.searchInput && this.searchInput.blur()
  }

  _onBlur = () => {
    if (this.state.value === '' && this.state.isFocused) {
      this.setState({
        isFocused: false,
      })
    }
    if (this.props.onBlur && typeof this.props.onBlur === 'function') {
      this.props.onBlur(this.state.value)
    }
  }

  _onFocus = () => {
    if (!this.state.isFocused) {
      this.setState({
        isFocused: true,
      })
    }
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(this.state.value)
    }
  }

  _clear = () => {
    this.setState({
      value: '',
    }, () => {
      if (this.props.onClear && typeof this.props.onClear === 'function') {
        this.props.onClear()
      }
      this.searchInput && this.searchInput.clear()
    })
  }

  _onSubmitEditing = () => {
    if (
      this.props.onSubmitEditing &&
      typeof this.props.onSubmitEditing === 'function'
    ) {
      this.props.onSubmitEditing(this.state.value)
    }
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Image
          style={styles.searchImg}
          resizeMode={'contain'}
          source={getAssets().mapTools.icon_search}
        />
        <TextInput
          ref={ref => (this.searchInput = ref)}
          underlineColorAndroid={'transparent'}
          defaultValue={this.props.defaultValue}
          editable={this.props.editable}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          style={styles.input}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          onSubmitEditing={this._onSubmitEditing}
          returnKeyLabel={this.props.returnKeyLabel}
          returnKeyType={this.props.returnKeyType}
          keyboardAppearance={this.props.keyboardAppearance}
          blurOnSubmit={this.props.blurOnSubmit}
          onChangeText={value => {
            this.setState({ value })
          }}
        />
        {
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={this._clear}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getAssets().mapTools.icon_input_clear}
            />
          </TouchableOpacity>
        }
      </View>
    )
  }
}
