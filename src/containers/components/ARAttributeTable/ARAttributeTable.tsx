import React, { Component } from 'react'
import { View, Text, FlatList, ListRenderItemInfo } from 'react-native'
import styles from './styles'

export interface ARAttributeType {
  title: string
  value: string
}

interface Props {
  attribute?:Array<ARAttributeType>
  // setARAttribute?: (params: Array<ARAttributeType>) => void
}


class ARAttributeTable extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
    }
  }


  // componentWillUnmount = () => {
  //   this.props.setARAttribute && this.props.setARAttribute([])
  // }


  renderItem = ({item}: ListRenderItemInfo<ARAttributeType> ) => {
    if(item.title === 'SmID') {
      return null
    }
    return (
      <View style = {[styles.row]} >
        <View style = {[styles.colLeft]} >
          <Text style = {[styles.textStyle]} >{item.title}</Text>
        </View>
        <View style = {[styles.colRight]} >
          <Text style = {[styles.textStyle]} >{item.value}</Text>
        </View>
      </View>
    )
  }


  render() {
    if(!this.props?.attribute
      || (this.props.attribute && this.props.attribute.length <= 0)
    ) {
      return null
    }

    return (
      <View
        style = {[styles.container]}
      >

        <FlatList
          style = {[{
            width: '100%',
            height: '100%',
          }]}
          data = {this.props.attribute}
          renderItem = {this.renderItem}
          keyExtractor = {item => item.title}
          showsVerticalScrollIndicator = {true}
          overScrollMode="never"
          // showsHorizontalScrollIndicator={false}
          // pagingEnabled={false}
        />
      </View>
    )
  }
}

export default ARAttributeTable
