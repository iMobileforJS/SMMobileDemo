/**
 * 两点定位的样式文件
 */
import { color } from '@/styles'
import { scaleSize } from '@/utils'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	positionDialog: {
		flexDirection: 'column',
	},
	positionRow: {
		flexDirection: 'row',
		height: scaleSize(100),
		alignItems: 'center',
		paddingHorizontal: scaleSize(15),
	},
	rowTitle: {
		width: scaleSize(80),
		fontSize: scaleSize(30),
		textAlign: 'center',
	},
	rowInput: {
		flex: 1,
		height: scaleSize(80),
		textAlign: 'center',
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: scaleSize(8),
	},
	buttons: {
		position: 'absolute',
		right: scaleSize(34),
		bottom: scaleSize(100),
		width: scaleSize(100),
		paddingVertical: scaleSize(10),
		flexDirection: 'column',
		backgroundColor: color.white,
		borderRadius: scaleSize(4),
		elevation: 20,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 1,
		shadowRadius: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},

	btnStyle: {
		width: scaleSize(80),
		height: scaleSize(60),
		backgroundColor: color.white,
		borderRadius: scaleSize(4),
		// elevation: 20,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 1,
		shadowRadius: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputItem: {
    height:scaleSize(60),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scaleSize(10),
    // backgroundColor: '#f00',
  },

	inputRowView: {
		width: '100%',
		height: scaleSize(60),
		flexDirection: 'row',
		// backgroundColor: '#f00',
		paddingHorizontal: scaleSize(10),
	},
	inputRowViewLeft: {
		flexDirection: 'row',
		flex:2,
		height:scaleSize(60),
		alignItems: 'center',
		marginRight: scaleSize(10),
	},
	inputRowViewLeftTitle: {
		fontSize: scaleSize(20),
		marginRight: scaleSize(5),
	},
	inputRowViewLeftValue: {
		fontSize: scaleSize(20),
	},
	inputRowViewRight: {
		flex: 3,
	},

	selectHeader: {
    width: scaleSize(100),
    height: scaleSize(30),
    // backgroundColor: '#f00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleSize(8),
  },
  selectHeaderText: {
    fontSize: scaleSize(20),
  },
	
})
