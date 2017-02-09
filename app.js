import React, {Component} from "react";
import {View, Text, StyleSheet, Platform, ListView, Keyboard} from "react-native";
import Header from "./header";
import Footer from "./footer";
import Row from "./row";

class App extends Component {
	constructor(props) {
		super(props);
		// ListView - A core component designed for efficient display of vertically
		// scrolling lists of changing data. The minimal API is to create a ListView.DataSource,
		// populate it with a simple array of data blobs, and instantiate a ListView component with
		// that data source and a renderRow callback which takes a blob from the data array and returns
		// a renderable component.
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			allComplete: false,
			value: "",
			items: [],
			dataSource: ds.cloneWithRows([])
		}
		this.setSource = this.setSource.bind(this);
		this.handleAddItem = this.handleAddItem.bind(this);
		this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
	}
	setSource(items, itemsDatasource, otherState = {}) {
		this.setState({
			items,
			dataSource: this.state.dataSource.cloneWithRows(itemsDatasource),
			...otherState
		})
	}
	handleToggleAllComplete() {
		const complete = !this.state.allComplete;
		const newItems = this.state.items.map((item) => ({
			...item,
			complete
		}))
		this.setSource(newItems, newItems, {allComplete: complete})
	}
	handleAddItem() {
		if(!this.state.value) return;
		const newItems = [
			...this.state.items,
			{
				key: Date.now(),
				text: this.state.value,
				complete: false
			}
		]
		this.setSource(newItems, newItems, {value: ""})
	}
	render() {
		return (
			<View style={styles.container}>
				<Header
					value={this.state.value}
					onAddItem={this.handleAddItem}
					onChange={(value) => this.setState({value})}
					onToggleAllComplete={this.handleToggleAllComplete}
				/>
					<View style={styles.content}>
						<ListView
							style={styles.list}
							enableEmptySections
							dataSource={this.state.dataSource}
							onScroll={() => Keyboard.dismiss()}
							renderRow={({key, ...value}) => {
								return (
									<Row
										key={key}
										{...value}
									/>
								)
							}}
							renderSeparator={(sectionId, rowId) => {
								return <View key={rowId} style={styles.separator}/>
							}}
						/>
					</View>
				<Footer />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
		...Platform.select({
			ios: {paddingTop: 30}
		})
	},
	content: {
		flex: 1,
	},
	list: {
		backgroundColor: '#FFF'
	},
	separator: {
		borderWidth: 1,
		borderColor: "#F5F5F5"
	}
})

export default App;
