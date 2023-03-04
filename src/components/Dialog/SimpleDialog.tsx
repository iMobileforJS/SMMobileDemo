import React, { PureComponent, ReactNode } from 'react'
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import Dialog from './Dialog'
import { scaleSize } from '@/utils/screen'
import { color } from '@/styles'
import { getLanguage } from '@/language/index'
import { icon_prompt } from './assets'

interface Props {
  confirmAction?: () => void,
  cancelAction?: () => void,
  dismissAction?: () => void,
  renderExtra?: () => void,
  style?: ViewStyle,
  text?: string,
  confirmText?: string,
  installText?: string,
  cancelText?: string,
  disableBackTouch?: boolean,
  buttonMode: string,
  confirmTitleStyle?: TextStyle,
  cancelTitleStyle?: TextStyle,
}

interface State {
  visible: boolean,
  confirmAction: () => void,
  cancelAction: () => void,
  dismissAction: () => void,
  text: string,
  textStyle: TextStyle,
  renderExtra: () => ReactNode,
  dialogStyle: ViewStyle,
  showTitleImage: boolean,
  confirmText: string,
  cancelText: string,
  renderCustomeView: (() => ReactNode )| undefined,
  disableBackTouch: boolean,
  buttonMode: string,
  cancelBtnVisible: boolean,
}

export default class SimpleDialog extends PureComponent<Props, State> {

  Dialog: Dialog | undefined | null

  static defaultProps = {
    disableBackTouch: true,
    buttonMode: 'row',
    text: '',
    confirmText: '',
    cancelText: '',
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      visible: false,
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      dismissAction: this.dismiss,
      text: '',
      textStyle: {},
      renderExtra: props.renderExtra ? props.renderExtra : this.renderExtra,
      dialogStyle: {},
      showTitleImage: true,
      confirmText: '',
      cancelText: '',
      renderCustomeView: undefined,
      disableBackTouch: !!this.props.disableBackTouch,
      buttonMode: props.buttonMode,
      cancelBtnVisible:true,
    }
  }

  setVisible(visible: boolean) {
    this.Dialog?.setDialogVisible(visible)
  }

  set = (params: {
    text?: string,
    textStyle?: TextStyle,
    confirmAction?: () => void,
    cancelAction?: () => void,
    dismissAction?: () => void,
    renderExtra?: () => ReactNode,
    dialogStyle?: ViewStyle,
    showTitleImage?: boolean,
    confirmText?: string,
    cancelText?: string,
    renderCustomeView?: () => ReactNode,
    disableBackTouch?: boolean,
    buttonMode?: string,
    cancelBtnVisible?: boolean,
  }) => {
    let confirm, cancel, dismiss
    const {
      text,
      textStyle,
      confirmAction,
      cancelAction,
      dismissAction,
      renderExtra,
      dialogStyle,
      showTitleImage,
      confirmText,
      cancelText,
      renderCustomeView,
      disableBackTouch,
      buttonMode,
      cancelBtnVisible,
    } = params
    if (confirmAction && typeof confirmAction === 'function') {
      confirm = () => {
        this.setVisible(false)
        confirmAction()
      }
    }
    if (cancelAction && typeof cancelAction === 'function') {
      cancel = () => {
        this.setVisible(false)
        cancelAction()
      }
    }
    if (dismissAction && typeof dismissAction === 'function') {
      dismiss = () => {
        this.setVisible(false)
        dismissAction()
      }
    }
    this.setState({
      text: text || '',
      textStyle: textStyle ? textStyle : {},
      confirmAction: confirmAction ? confirm || this.confirm : this.confirm,
      cancelAction: cancelAction ? cancel || this.cancel : this.cancel,
      dismissAction: dismissAction ? dismiss || this.dismiss : this.dismiss,
      renderExtra: renderExtra ? renderExtra : this.renderExtra,
      dialogStyle: dialogStyle ? dialogStyle : {},
      showTitleImage: showTitleImage !== undefined ? showTitleImage : true,
      confirmText: confirmText || '',
      cancelText: cancelText || '',
      renderCustomeView: renderCustomeView,
      disableBackTouch:
        disableBackTouch === undefined
          ? !!this.props.disableBackTouch
          : disableBackTouch,
      buttonMode: buttonMode ? buttonMode : this.props.buttonMode,
      cancelBtnVisible: cancelBtnVisible === undefined? true : cancelBtnVisible,
    })
  }

  reset = () => {
    this.setState({
      text: '',
      textStyle: {},
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      dismissAction: this.dismiss,
      renderExtra: this.renderExtra,
      dialogStyle: {},
      showTitleImage: true,
      confirmText: '',
      cancelText: '',
      renderCustomeView: undefined,
      disableBackTouch: !!this.props.disableBackTouch,
      buttonMode: this.props.buttonMode,
    })
  }

  confirm = () => {
    this.props.confirmAction && this.props.confirmAction()
    this.setVisible(false)
  }

  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()
    this.setVisible(false)
  }

  dismiss = () => {
    this.props.dismissAction && this.props.dismissAction()
    this.setVisible(false)
  }

  renderExtra = () => {
    return <View />
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.Dialog = ref)}
        type={'modal'}
        confirmBtnTitle={
          this.state.confirmText !== ''
            ? this.state.confirmText
            : this.props.confirmText !== ''
              ? this.props.confirmText
              : getLanguage().Prompt.CONFIRM
        }
        cancelBtnTitle={
          this.state.cancelText !== ''
            ? this.state.cancelText
            : this.props.cancelText !== ''
              ? this.props.cancelText
              : getLanguage().Prompt.CANCEL
        }
        confirmAction={this.state.confirmAction}
        cancelAction={this.state.cancelAction}
        dismissAction={this.state.dismissAction}
        confirmTitleStyle={this.props.confirmTitleStyle}
        cancelTitleStyle={this.props.cancelTitleStyle}
        disableBackTouch={this.state.disableBackTouch}
        buttonMode={this.state.buttonMode}
        cancelBtnVisible={this.state.cancelBtnVisible}
      >
        {this.state.renderCustomeView ? (
          this.state.renderCustomeView()
        ) : (
          <View style={styles.dialogHeaderView}>
            {this.state.showTitleImage && (
              <Image
                source={icon_prompt}
                style={styles.dialogHeaderImg}
              />
            )}
            <Text style={[styles.promptTitle, this.state.textStyle]}>
              {this.state.text !== '' ? this.state.text : this.props.text}
            </Text>
            {this.state.renderExtra()}
          </View>
        )}
      </Dialog>
    )
  }
}

const styles = StyleSheet.create({
  dialogHeaderView: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    marginTop: scaleSize(10),
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  promptTitle: {
    fontSize: scaleSize(24),
    lineHeight: scaleSize(32),
    color: color.BLACK,
    marginTop: scaleSize(5),
    marginHorizontal: scaleSize(10),
    textAlign: 'center',
  },
  dialogBackground: {
    height: scaleSize(250),
  },
})
