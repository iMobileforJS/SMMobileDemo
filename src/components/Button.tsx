import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, ViewStyle, TextStyle, Image, ImageSourcePropType, StyleProp } from 'react-native'
import { AppStyle, color } from '../styles'

type IProp = {
  style?: StyleProp<ViewStyle>,
  titleStyle?: TextStyle,
  title?: string,
  image?: ImageSourcePropType,
  onPress: () => void
} & Partial<IDefaultProps>

interface IDefaultProps {
  activeOpacity: number,
  color: 'DEFAULT' | 'WHITE',
  disabled: boolean,
}

const defaultProps = {
  activeOpacity: 0.8,
  color: 'DEFAULT',
  disabled: false,
}

const Button = class Button extends PureComponent<IProp & IDefaultProps> {
  static defaultProps = defaultProps

  action = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    let style: ViewStyle = {}
    let textStyle: TextStyle = {}
    switch (this.props.color) {
      case 'WHITE':
        style = {
          backgroundColor: color.LIGHT_WIHTE,
          borderColor: color.LIGHT_GRAY,
        }
        textStyle = {
          color: color.BLACK
        }
        break
      default:
        break
    }
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={this.props.title}
        activeOpacity={this.props.activeOpacity}
        style={[AppStyle.ButtonStyle, style, this.props.style]}
        onPress={this.action}
        disabled={this.props.disabled}
      >
        {this.props.image && (
          <Image
            style={[
              AppStyle.ButtomImageStyle,
            ]}
            source={this.props.image}
          />
        )}
        {this.props.title && (
          <Text
            style={[
              AppStyle.ButtonTextStyle,
              textStyle,
              this.props.titleStyle,
            ]}
          >
            {this.props.title}
          </Text>
        )}
      </TouchableOpacity>
    )
  }
} as React.ComponentClass<IProp>

export default Button