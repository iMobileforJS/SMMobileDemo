/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, ActivityIndicator, Text, ViewStyle, TextStyle, StyleProp, StyleSheet } from 'react-native'

interface Props {
  style?: StyleProp<ViewStyle>,
  titleStyle?: StyleProp<TextStyle>,
  loadingStyle?: StyleProp<ViewStyle>,
  loadingColor?: string,
  loadingAnimating?: boolean,
  title?: string,
  flexDirection?: string,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    flex: 1,
    lineHeight: 20,
    fontSize: 12,
    textAlign: 'center',
  },
  title: {
    flex: 1,
    lineHeight: 20,
    fontSize: 12,
    textAlign: 'center',
  },
})

export default class IndicatorLoading extends PureComponent<Props> {

  static defaultProps = {
    flexDirection: 'column',
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          { flexDirection: this.props.flexDirection },
          this.props.style,
        ]}
      >
        <ActivityIndicator
          style={[styles.indicator, this.props.loadingStyle]}
          color={this.props.loadingColor}
          animating={this.props.loadingAnimating}
        />
        {this.props.title && (
          <Text style={[styles.title, this.props.titleStyle]}>
            {this.props.title}
          </Text>
        )}
      </View>
    )
  }
}
