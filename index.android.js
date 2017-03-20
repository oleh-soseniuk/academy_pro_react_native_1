/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Button,
  Platform,
  Dimensions,
  Linking,
  TouchableOpacity
} from 'react-native';

import MapView from 'react-native-maps';
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height
const DATA_URI = 'https://teamtreehouse.com/matthew.json';

export default class test extends Component {
  constructor(props) {
    super(props);
    this.state = {
       dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2}),
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        markerCoords: null,
        view: null
    };
    this.renderHolderView = this.renderHolderView.bind(this);
    this.renderMainView = this.renderMainView.bind(this);
    this.renderBackButton = this.renderBackButton.bind(this);
    this.onPressLearnMore = this.onPressLearnMore.bind(this);
    this.onSelectView = this.onSelectView.bind(this);
    this.openUrl = this.openUrl.bind(this);
    this.getDate = this.getDate.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }
  
  fetchData() {
    fetch(DATA_URI).then((response) => {
      return response.json();
    })
    .then((responseData) => {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(responseData.badges)});
    });
  }

  openUrl(url) {
    Linking.openURL(url);
  }

  getDate(date){
    const d = new Date(date);
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  }

  renderListView() {
    return (
      <View>
         {this.renderBackButton()}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderHolderView}
        />
      </View>
    );
  }

  onPressLearnMore() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        const {latitudeDelta, longitudeDelta} = that.state.region;
        that.setState({
          region: {
            latitudeDelta,
            longitudeDelta,
            latitude,
            longitude
          },
          markerCoords: {
            latitude,
            longitude
        }});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 10000}
    );
  }

  renderHolderView (data) {
      return (
        <View style={styles.listItem}>
            <Text style={styles.listItemId}>{data.id}</Text>
            <Text style={styles.listItemName} onPress={() => this.openUrl(data.url)}>{data.name}</Text>
            <Text style={styles.listItemDate}>{this.getDate(data.earned_date)}</Text>
            <View style={styles.listItemIconHolder}>
              <Image
                style={styles.listItemIcon}
                source={{uri: data.icon_url}}
              />
            </View>
        </View>
      );
  }

  renderMapView() {
    return (
      <View style={styles.container}>
       
        <MapView
          style={styles.map}
          region={this.state.region}
          region={this.state.region}>
          {this.state.markerCoords && 
          <MapView.Marker
            coordinate={this.state.markerCoords}
          />}
        </MapView>
         <View style={styles.topBtnContainer}>
          {this.renderBackButton()}
        </View>
        <View style={styles.btnContainer}>
          <Button
            onPress={this.onPressLearnMore}
            title="Set Pin To My Location"
            color="#841584"
            style={styles.btn}
            accessibilityLabel="Set Pin To My Location"
          />
        </View>
      </View>
    );
  }
  onSelectView(e, view) {
    this.setState({
        view
    });
  }
  renderBackButton() {
    return (
        <TouchableOpacity onPress={(e) => this.onSelectView(e, null)}>
          <View style={styles.backBtn}>
              <Text style={styles.mainBtnText}>
              Back
              </Text>
          </View>
        </TouchableOpacity>
    );
  }
  renderMainView(){
    return (
      <View style={styles.main}>
        <TouchableOpacity onPress={(e) => this.onSelectView(e, 'map')}>
          <View style={styles.mainBtn}>
              <Text style={styles.mainBtnText}>
              Render MapView
              </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={(e) => this.onSelectView(e, 'list')}>
          <View style={styles.mainBtn}>
              <Text style={styles.mainBtnText}>
              Render ListView
              </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { view } = this.state;
    if (view === 'map') {
      return this.renderMapView();
    } else if (view === 'list') {
      return this.renderListView();
    } else {
      return this.renderMainView();
    }
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  backBtn: {
     backgroundColor: '#337AB7',
     borderRadius:5,
     paddingLeft: 40,
     paddingRight: 40,
     paddingTop: 10,
     paddingBottom: 10,
     zIndex: 1000
  },
  mainBtn: {
     backgroundColor: '#337AB7',
     borderRadius:5,
     paddingLeft: 40,
     paddingRight: 40,
     paddingTop: 10,
     paddingBottom: 10,
     marginBottom: 20
  },
  mainBtnText: {
     fontSize: 25,
     textAlign: 'center',
     color: '#FFFFFF',
   },
  listItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1
  },
  listItemId: {
    flex: 1
  },
  listItemName: {
    flex: 5
  },
  listItemDate: {
    flex: 2
  },
  listItemIconHolder: {
    flex: 1
  },
  listItemIcon: {
    width: 50,
    height: 50,
    alignSelf: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBtnContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-start'
  },
  btnContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-end'
  }
 });


AppRegistry.registerComponent('test', () => test);
