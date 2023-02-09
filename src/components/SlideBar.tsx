import React, { Component } from 'react'
import { View, PanResponder, ViewStyle, PanResponderInstance, GestureResponderEvent, PanResponderGestureState, Dimensions, StyleSheet } from 'react-native'

interface Props extends Partial<IDefaultProps> {
  style?: ViewStyle,
  onStart?: () => void,
  onMove: (loc: number, isGesture: boolean, isMinValue?: boolean) => void,
  onEnd?: () => void,
  onMaxReach?: (maxValue: number,isGesture: boolean) => void
  sizer?: (input: number) => number
}

interface State {
  left: number
  right: number
}

interface IDefaultProps {
  range: [number, number]
  defaultMinValue: number
  defaultMaxValue: number
  mode: 'single' | 'double'
  disabled: boolean
  /** 横向显示 */
  horizontal: boolean
}

const defaultProps: IDefaultProps = {
  range: [0, 100,],
  defaultMinValue: 0,
  defaultMaxValue: 0,
  mode: 'single',
  disabled: false,
  horizontal: true,
}

const GRAY =  '#959595'

export default class SlideBar extends Component<Props & typeof defaultProps, State> {

  static defaultProps = defaultProps

  panResponder: PanResponderInstance

  /** 是否滑动中 */
  isMoving = false

  /** 范围刻度 */
  count: number

  /** 是否正在调整最大值滑块 */
  isControlMax = true

  /** 记录开始滑动的最小值 */
  startMinValue: number

  /** 记录开始滑动的最大值 */
  startMaxValue: number

  /** 当前最小值 */
  currentMinValue: number

  /** 当前最大值 */
  currentMaxValue: number

  constructor(props: Props & typeof defaultProps) {
    super(props)

    this.count = Math.abs(this.props.range[1] - this.props.range[0])

    if(this.props.mode === 'single') {
      this.currentMinValue = this.props.range[0]
      this.currentMaxValue = this.props.defaultMaxValue
    } else {
      this.currentMinValue = this.props.defaultMinValue
      this.currentMaxValue = this.props.defaultMaxValue
    }

    this.startMinValue = this.currentMinValue
    this.startMaxValue = this.currentMaxValue

    this.state = {
      left: this.getLocation(this.currentMinValue),
      right: this.getLocation(this.currentMaxValue),
    }
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.onStart,
      onPanResponderMove: this.onPanMove,
      onPanResponderRelease: this.onPanRelease,
      onPanResponderTerminate: this.onPanRelease,
    })
  }

  dp = (input: number): number => {
    if(this.props.sizer) {
      return this.props.sizer(input)
    }
    return input
  }


  componentDidUpdate(prevProps: Props & typeof defaultProps) {
    if(prevProps.defaultMaxValue !== this.props.defaultMaxValue
      || prevProps.defaultMinValue !== this.props.defaultMinValue
      || prevProps.mode !== this.props.mode
      || prevProps.range !== this.props.range
    ) {
      if(this.props.mode === 'single') {
        this.updateParams(this.props.range[0], this.props.defaultMaxValue)
      } else {
        this.updateParams(this.props.defaultMinValue, this.props.defaultMaxValue)
      }
    } else if(prevProps.horizontal !== this.props.horizontal) {
      this.updateParams(this.currentMinValue, this.currentMaxValue)
    }
  }

  updateParams = (minValue: number, maxValue: number) => {
    this.count = Math.abs(this.props.range[1] - this.props.range[0])

    this.setState({
      left: this.getLocation(minValue),
      right: this.getLocation(maxValue)
    })
    this.currentMinValue = this.startMinValue = minValue
    this.currentMaxValue = this.startMaxValue = maxValue
  }

  /** 横向为宽度， 纵向为高度 */
  barLength?: number

  _getBarLength = (): number => {
    if (this.barLength!== undefined) return this.barLength
    const width = typeof this.props.style?.width === 'number' ?  this.props.style?.width : Dimensions.get('window').width
    const height = typeof this.props.style?.height === 'number' ? this.props.style.height: Dimensions.get('window').height
    return this.props.horizontal ? width : height
  }

  //根据位置获取值
  getValue = (location: number) => {
    return this.props.horizontal ? (
      Math.round((this.count * location) / this._getBarLength()) + this.props.range[0]
    ) : (
      this.props.range[1] -  Math.round((this.count * location) / this._getBarLength())
    )
  }

  //根据值获取位置
  getLocation = (value: number) => {
    return this.props.horizontal ? (
      (this._getBarLength() * (value - this.props.range[0])) / this.count
    ) : (
      (this._getBarLength() * (this.props.range[1] - value)) / this.count
    )
  }

  increment = () => {
    this.isControlMax = true
    const value = this.currentMaxValue + 1
    if (value > this.props.range[1]) {
      this.onMove(this.getLocation(this.currentMaxValue), false)
      return
    }
    const location = this.getLocation(value)
    this.setState({
      right: location,
    })
    this.onMove(this.getLocation(value), false)
  }

  decrement = () => {
    if(this.props.mode === 'single') {
      this.isControlMax = true
      const value = this.currentMaxValue - 1
      if (value < this.props.range[0]) return
      const location = this.getLocation(value)
      this.setState({
        right: location,
      })
      this.onMove(this.getLocation(value), false)
    } else {
      this.isControlMax = false
      const value = this.currentMinValue - 1
      if (value < this.props.range[0]) return
      const location = this.getLocation(value)
      this.setState({
        left: location,
      })
      this.onMove(this.getLocation(value), false)
    }
  }

  onStart = (evt: GestureResponderEvent) => {
    if(this.props.disabled) return
    this.isMoving = true
    if(this.props.mode === 'single') {
      this.isControlMax = true
    } else {
      const startLoc = this.props.horizontal ? evt.nativeEvent.locationX : evt.nativeEvent.locationY
      const startValue = this.getValue(startLoc)
      if(Math.abs(startValue - this.currentMaxValue) > Math.abs(startValue - this.currentMinValue)) {
        this.isControlMax = false
      } else {
        this.isControlMax = true
      }
    }
    this.startMaxValue = this.currentMaxValue
    this.startMinValue = this.currentMinValue
    this.props.onStart && this.props.onStart()
  }

  onPanMove = (evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
    if(this.props.disabled) return
    const offset = this.props.horizontal ? gesture.dx : gesture.dy
    //获取移动前位置
    const currentLocation = this.isControlMax ? this.getLocation(this.startMaxValue) : this.getLocation(this.startMinValue)
    //计算本次移动后的位置
    let location = currentLocation + offset
    if (location > this._getBarLength()) location = this._getBarLength()
    if (location < 0) location = 0
    if(this.isControlMax) {
      //最大值不能小于等于最小值
      if(this.props.mode === 'double' && this.getValue(location) <= this.currentMinValue) return
      location = this.getLocation(this.getValue(location))
      this.setState({
        right: location,
      })
    } else {
      //最小值不能大于等于最大值
      if(this.props.mode === 'double' && this.getValue(location) >= this.currentMaxValue) return
      location = this.getLocation(this.getValue(location))
      this.setState({
        left: location,
      })
    }
    this.onMove(location, true)
  }

  onPanRelease = (evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
    if(this.props.disabled) return
    this.isMoving = false
    let location = this.isControlMax ? this.getLocation(this.currentMaxValue) : this.getLocation(this.currentMinValue)
    const offset = this.props.horizontal ? gesture.dx : gesture.dy
    if (offset === 0) {
      location = this.props.horizontal ? evt.nativeEvent.locationX : evt.nativeEvent.locationY
      if (location > this._getBarLength()) location = this._getBarLength()
      if (location < 0) location = 0
      location = this.getLocation(this.getValue(location))
      if(this.isControlMax) {
        //最大值不能小于等于最小值
        if(this.props.mode === 'double' && this.getValue(location) <= this.currentMinValue) return
        this.setState({
          right: location,
        })
      } else {
        //最小值不能大于等于最大值
        if(this.props.mode === 'double' && this.getValue(location) >= this.currentMaxValue) return
        this.setState({
          left: location,
        })
      }
    }
    this.onEnd(location)
  }

  onMove = (location: number, isGesture: boolean) => {
    if(this.isControlMax) {
      if(this.getValue(location) === this.props.range[1]) {
        this.props.onMaxReach?.(this.getValue(location), isGesture)
      }
      if (this.currentMaxValue !== this.getValue(location)) {
        this.currentMaxValue = this.getValue(location)
        this.props.onMove(this.currentMaxValue, isGesture)
      }
    } else {
      if(this.currentMinValue !== this.getValue(location)) {
        this.currentMinValue = this.getValue(location)
        this.props.onMove(this.currentMinValue, isGesture, true)
      }
    }
  }

  onEnd = (location: number) => {
    this.onMove(location, true)
    this.props.onEnd && this.props.onEnd()
  }

  onClear = () => {
    this.currentMinValue = this.props.defaultMinValue
    this.currentMaxValue = this.props.defaultMaxValue
    this.setState({
      left: this.getLocation(this.props.defaultMinValue),
      right: this.getLocation(this.props.defaultMaxValue),
    })
  }

  render() {
    return (
      <View
        style={[
          this.props.horizontal ? this.styles.containerStyle : this.styles.containerStyleL,
          this.props.style,
        ]}
        {...this.panResponder.panHandlers}
        onLayout={e => {
          const width =  e.nativeEvent.layout.width
          const height = e.nativeEvent.layout.height
          const length = this.props.horizontal ? width : height
          if(!this.isMoving && (this.barLength === undefined || this.barLength !== length)) {
            this.barLength = length
            this.updateParams(this.currentMinValue, this.currentMaxValue)
          } else {
            this.barLength = length
          }
        }}
      >
        <View
          style={this.props.horizontal ? this.styles.backgroundLine : this.styles.backgroundLineL}
        >
          <View
            style={[
              this.props.horizontal ? this.styles.valueLine : this.styles.valueLineL,
              this.props.horizontal ? {
                right: this._getBarLength() - this.state.right,
                left: this.props.mode === 'double' ? this.state.left : 0,
              } : {
                top: this.state.right,
                bottom: this.props.mode === 'double' ? this._getBarLength() - this.state.left : 0
              },
              {backgroundColor: this.props.disabled ? GRAY : '#000000'}
            ]}
          >
            {this.props.mode === 'double' && (
              <View
                style={[
                  this.styles.indicator,
                  this.props.horizontal ? {
                    top: -this.dp(8),
                    left:  -this.dp(8),
                  } : {
                    right: -this.dp(8),
                    bottom: -this.dp(8)
                  },
                  {borderColor: this.props.disabled ? GRAY : '#000000'}
                ]}
                pointerEvents={'none'}
              />
            )}

            <View
              style={[
                this.styles.indicator,
                this.props.horizontal ? {
                  top: -this.dp(8),
                  right:  -this.dp(8),
                } : {
                  right: -this.dp(8),
                  top: -this.dp(8)
                },
                {borderColor: this.props.disabled ? GRAY : '#000000'}
              ]}
              pointerEvents={'none'}
            />
          </View>
        </View>
      </View>
    )
  }


styles = StyleSheet.create({
  containerStyle: {
    height: this.dp(45),
    justifyContent: 'center',
  },
  containerStyleL: {
    width: this.dp(45),
    alignItems: 'center',
  },
  backgroundLine: {
    width: '100%',
    height: this.dp(2),
    backgroundColor: '#F1F3F8',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backgroundLineL: {
    height: '100%',
    width: this.dp(2),
    backgroundColor: '#F1F3F8',
    alignItems: 'center',
  },
  valueLine: {
    position: 'absolute',
    height: this.dp(2),
  },
  valueLineL: {
    position: 'absolute',
    width: this.dp(2),
  },
  indicator: {
    position: 'absolute',

    width: this.dp(16),
    height: this.dp(16),
    borderWidth: this.dp(2),
    borderRadius: this.dp(8),
    backgroundColor: '#FFFFFF',
  }
})
}

