/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native'
import { scaleSize } from '@/utils'

import styles from './styles'
import { getLanguage } from '@/language'

interface Props {
  type?: string,
  style?: any,
  titleStyle?: any,
  infoStyle?: any,
  backgroundStyle?: any,
  children?: any,
  title?: string,
  info?: string,
  backHide?: boolean,
  activeOpacity?: number,
  cancelBtnTitle?: string,
  confirmBtnTitle?: string,
  confirmBtnVisible?: boolean,
  cancelBtnVisible?: boolean,
  confirmBtnDisable?: boolean,
  cancelBtnDisable?: boolean,
  cancelBtnStyle?: ViewStyle,
  confirmBtnStyle?: ViewStyle,
  confirmAction?: () => void,
  cancelAction?: () => void,
  dismissAction?: () => void,
  confirmTitleStyle?: any,
  cancelTitleStyle?: any,
  showBtns?: boolean,
  defaultVisible?: boolean,
  header?: any,
  opacity?: any,
  opacityStyle?: Object,
  onlyOneBtn?: boolean,
  disableBackTouch?: boolean,
  buttonMode?: String,
}

interface State {
  visible: boolean,
  confirmPress: boolean,
  cancelPress: boolean,
}

export default class Dialog extends PureComponent<Props, State> {

  static defaultProps = {
    type: 'non_modal',
    title: undefined,
    activeOpacity: 0.8,
    cancelBtnTitle: getLanguage().Prompt.CANCEL,
    confirmBtnTitle: getLanguage().Prompt.CONFIRM,
    showBtns: true,
    confirmBtnVisible: true,
    cancelBtnVisible: true,
    confirmBtnDisable: false,
    cancelBtnDisable: false,
    onlyOneBtn: false,
    defaultVisible: false,
    disableBackTouch: true,
    buttonMode: 'default',
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      visible: this.props.defaultVisible || false,
      confirmPress: false,
      cancelPress: false,
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
  //     JSON.stringify(nextState) !== JSON.stringify(this.state)
  //   ) {
  //     return true
  //   }
  //   return false
  // }

  //控制Modal框是否可以展示
  setDialogVisible(visible: boolean) {
    visible !== this.state.visible && this.setState({ visible: visible })
  }

  getState = () => {
    return this.state
  }

  confirm = () => {
    if (this.props.confirmBtnDisable) return
    this.props.confirmAction && this.props.confirmAction()
  }

  cancel = () => {
    if (this.props.cancelBtnDisable) return
    this.props.cancelAction && this.props.cancelAction()

    this.setDialogVisible(false)
  }

  renderListBtns = () => {
    let confirmPressColor = this.state.confirmPress ? { color: '#4680DF' } : {}
    let cancelPressColor = this.state.cancelPress ? { color: '#4680DF' } : {}
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(160),
          marginTop: scaleSize(50),
        }}
      >
        <View style={styles.separateLineL} />
        <TouchableOpacity
          activeOpacity={this.props.activeOpacity}
          style={[styles.btnStyle, this.props.confirmBtnStyle]}
          onPress={this.confirm}
          onPressIn={() => {
            !this.props.confirmBtnDisable &&
              this.setState({
                confirmPress: true,
              })
          }}
          onPressOut={() => {
            !this.props.confirmBtnDisable &&
              this.setState({
                confirmPress: false,
              })
          }}
        >
          <Text
            style={[
              this.props.confirmBtnDisable
                ? styles.btnDisableTitle
                : styles.btnTitle,
              confirmPressColor,
              this.props.confirmTitleStyle,
            ]}
          >
            {this.props.confirmBtnTitle}
          </Text>
        </TouchableOpacity>

        <View style={styles.separateLineL} />
        <TouchableOpacity
          activeOpacity={this.props.activeOpacity}
          style={[styles.btnStyle, this.props.cancelBtnStyle]}
          onPress={this.cancel}
          onPressIn={() => {
            this.setState({
              cancelPress: true,
            })
          }}
          onPressOut={() => {
            this.setState({
              cancelPress: false,
            })
          }}
        >
          <Text
            style={[
              this.props.cancelBtnDisable
                ? styles.btnDisableTitle
                : styles.btnTitle,
              cancelPressColor,
              this.props.cancelTitleStyle,
            ]}
          >
            {this.props.cancelBtnTitle}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderBtns = () => {
    let confirmPressColor = this.state.confirmPress ? { color: '#4680DF' } : {}
    let cancelPressColor = this.state.cancelPress ? { color: '#4680DF' } : {}
    if (!this.props.showBtns) return null
    if (this.props.buttonMode === 'list') {
      return this.renderListBtns()
    }
    let btnViewStyle: ViewStyle | ViewStyle[] = this.props.onlyOneBtn ? styles.oneBtn : styles.btns
    if (this.props.buttonMode === 'row' || !this.props.children) {
      //SimpleDialog使用
      btnViewStyle = [btnViewStyle, { marginTop: scaleSize(50) }]
    }
    return (
      <View style={btnViewStyle}>
        {this.props.cancelBtnVisible && (
          <TouchableOpacity
            activeOpacity={this.props.activeOpacity}
            style={[styles.btnStyle, this.props.cancelBtnStyle]}
            onPress={this.cancel}
            onPressIn={() => {
              this.setState({
                cancelPress: true,
              })
            }}
            onPressOut={() => {
              this.setState({
                cancelPress: false,
              })
            }}
          >
            <Text
              style={[
                this.props.cancelBtnDisable
                  ? styles.btnDisableTitle
                  : styles.btnTitle,
                cancelPressColor,
                this.props.cancelTitleStyle,
              ]}
            >
              {this.props.cancelBtnTitle}
            </Text>
          </TouchableOpacity>
        )}
        {this.props.cancelBtnVisible && this.props.confirmBtnVisible && (
          <View style={styles.separateLine} />
        )}
        {this.props.confirmBtnVisible && (
          <TouchableOpacity
            activeOpacity={this.props.activeOpacity}
            style={[styles.btnStyle, this.props.confirmBtnStyle]}
            onPress={this.confirm}
            onPressIn={() => {
              !this.props.confirmBtnDisable &&
                this.setState({
                  confirmPress: true,
                })
            }}
            onPressOut={() => {
              !this.props.confirmBtnDisable &&
                this.setState({
                  confirmPress: false,
                })
            }}
          >
            <Text
              style={[
                this.props.confirmBtnDisable
                  ? styles.btnDisableTitle
                  : styles.btnTitle,
                confirmPressColor,
                this.props.confirmTitleStyle,
              ]}
            >
              {this.props.confirmBtnTitle}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderModal = () => {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.visible}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        onRequestClose={() => {
          //点击物理按键需要隐藏对话框
          if (this.props.backHide) {
            this.setDialogVisible(false)
          }
        }}
      >
        <View style={styles.container}>
          <TouchableOpacity
            disabled={this.props.disableBackTouch}
            onPress={() => {
              if (this.props.dismissAction) {
                this.props.dismissAction()
              } else {
                this.setDialogVisible(false)
              }
            }}
            activeOpacity={1}
            style={[
              {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0},
              this.props.backgroundStyle,
              this.props.opacity > 0 && { opacity: this.props.opacity },
            ]}
          />
          {this.props.header}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' && 'position'}
          >
            <View style={[styles.dialogStyle, this.props.style]}>
              {this.props.title && (
                <Text style={[styles.title, this.props.titleStyle]}>
                  {this.props.title}
                </Text>
              )}
              {this.props.info && (
                <Text style={[styles.info, this.props.infoStyle]}>
                  {this.props.info}
                </Text>
              )}
              {this.props.children}
              {/*<View style={styles.childrenContainer}>{this.props.children}</View>*/}
              {this.renderBtns()}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    )
  }

  renderNonModal = () => {
    if (this.state.visible) {
      return (
        <View style={[styles.nonModalContainer, this.props.backgroundStyle]}>
          <TouchableOpacity
            style={[
              styles.nonModalContainer,
              { backgroundColor: 'rgba(0,0,0,0.3)' },
              this.props.backgroundStyle,
            ]}
            disabled={this.props.disableBackTouch}
            onPress={() => {
              if (this.props.dismissAction) {
                this.props.dismissAction()
              } else {
                this.setDialogVisible(false)
              }
            }}
            activeOpacity={1}
            pointerEvents={'box-none'}
          />
          {this.props.header}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={[styles.dialogStyle, this.props.style]}>
              {this.props.title && (
                <Text style={[styles.title, this.props.titleStyle]}>
                  {this.props.title}
                </Text>
              )}
              {this.props.info && (
                <Text style={[styles.info, this.props.infoStyle]}>
                  {this.props.info}
                </Text>
              )}
              {this.props.children}
              {this.renderBtns()}
            </View>
          </KeyboardAvoidingView>
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    if (this.props.type === 'modal') {
      return this.renderModal()
    } else {
      return this.renderNonModal()
    }
  }
}

Dialog.Type = {
  MODAL: 'modal',
  NON_MODAL: 'non_modal',
}
