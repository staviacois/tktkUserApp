// ----------------------------------------
// ----- Imports

// npm
import React, {Component} from 'react';
import {Text} from 'react-native';
import {Icon, ListItem, Body, Right, Card} from 'native-base';

// libs
import * as text from '../../libs/text.js';

export default class Resto extends Component {
  // This component represents a line in a Card component, and gives access to RestoView


  // ----------------------------------------
  // ----- Component actions

  constructor(props) {
    super(props);
  }


  // ----------------------------------------
  // ----- Our actions

  getAction() {
    return {
      showLine: () => {
        const {
          navigator,
          line,
          from
        } = this.props;

        navigator.push({
          title: 'RestoView',
          params: {
            line: line,
            from: from
          }
        });
      }
    };
  }

  getText(code) {
    return text.getText("ListRestoView." + code);
  }
  distanceBtw2Points(pointa, pointb) {
    var toRad = function(x) {
      return x * Math.PI / 180;
    }
    var R = 6371000; // metres
    var φ1 = toRad(pointa.lat);
    var φ2 = toRad(pointb.lat);
    var Δφ = toRad(pointb.lat - pointa.lat);
    var Δλ = toRad(pointb.lng - pointa.lng);
    var x = Δλ * Math.cos((φ1 + φ2) / 2);
    var y = Δφ;
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
  }


  // ----------------------------------------
  // ----- Render

  render() {
    const actions = this.getAction();

    const {
      line,
      pos
    } = this.props;
    
    const address = line.adress;

    const iconEnable = line.settings.enable
    ? (<Icon name='checkmark-circle' style={{
      color: 'green'
    }}/>)
    : (<Icon name='close-circle' style={{
      color: 'red'
    }}/>);

    const distanceView = pos && line.position.loc
    ? (() => {

      pointa = {
        lng: pos.longitude,
        lat: pos.latitude
      };
      pointb = {
        lng: line.position.loc.coordinates[0],
        lat: line.position.loc.coordinates[1]
      }

      const distance = Math.round(this.distanceBtw2Points(pointa, pointb));

      return (
        <ListItem>
          <Icon name='people' style={nativeStyles.icon}/>
          <Text style={nativeStyles.textMargin}>{line.peoplewaiting + " pers"}</Text>
          <Icon name='compass' style={nativeStyles.icon}/>
          <Text>{distance + " m"}</Text>
        </ListItem>
      )
    })()
    : (
      <ListItem>
        <Icon name='people' style={nativeStyles.icon}/>
        <Text>{line.peoplewaiting + " pers"}</Text>
      </ListItem>
    );

    return (
      <Card style={nativeStyles.container}>
        <ListItem>
          <Body>
            <Text style={nativeStyles.linename}>{line.linename}</Text>
          </Body>
          <Right>
            {iconEnable}
          </Right>
        </ListItem>
        {distanceView}
        <ListItem>
          <Icon name='navigate' style={nativeStyles.icon}/>
          <Text>{address.route + " " + address.street_number + ", " + address.postal_code + " " + address.locality}</Text>
        </ListItem>
        <ListItem style={nativeStyles.details} onPress={() => actions.showLine()}>
          <Body style={nativeStyles.detailsBody}>
            <Text>{this.getText('label_details')}</Text>
          </Body>
          <Right>
            <Icon name="arrow-forward"/>
          </Right>
        </ListItem>
      </Card>
    );
  }
}


// ----------------------------------------
// ----- Styles

var nativeStyles = {
  container: {
    margin: 10
  },
  details: {
    borderWidth: 0
  },
  detailsBody: {
    justifyContent: 'center'
  },
  linename: {
    fontWeight: '600'
  },
  icon: {
    marginRight: 6
  },
  textMargin: {
    marginRight: 10
  }
};
