import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
const RCTNetworking = require('RCTNetworking');

const DOMAIN = 'http://localhost:3002';
const api = url => `${DOMAIN}${url}`;

const headers = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, last-read-activity-timestamp',
};

const cookiesConf = {
  credentials: 'include',
  httpOnly: true,
  secure: true,
  headers,
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
      token: '',
      error: null,
    }
  }
  componentDidMount() {
    fetch(api('/data'), cookiesConf)
      .then(response => response.json())
      .then(({ counter, error }) =>
        this.setState({ counter, error })
      ).catch((error) => this.setState({ error: error }));
  }
  onGetFromServer = () => {
    fetch(api('/data'), cookiesConf)
      .then(response => response.json())
      .then(({ counter, error }) => {
        this.setState({ counter, error })
      }).catch((error) => this.setState({ error: error }));
  }
  onLogin = () => {
    fetch(api('/login'), cookiesConf)
      .then(response => response.json())
      .then(({ token, error }) => {
        this.setState({ token, error: '' })
      }).catch((error) => this.setState({ error: error }));
  }
  onClearCookies = () => {
    RCTNetworking.clearCookies(() => {
      this.setState({ token: '', error: 'Cookies is empty' });
    });
  }
  render() {
    const { counter, token, error } = this.state;
    return (
      <View style={styles.container}>
        {
          !error ?
            <View>
              <Text>{`Some Data from server: ${counter || 0}, by token ${token}`}</Text>
              <TouchableOpacity
                onPress={this.onGetFromServer}
              >
                <Text style={styles.button}>Get from server</Text>
              </TouchableOpacity>
            </View> : null
        }

        {
          error ?
          <View>
            <Text>Auth error:  <Text>{`${error.message || error}`}</Text>
            </Text>
            <TouchableOpacity
              onPress={this.onLogin}
            >
              <Text style={styles.button}>Sign in </Text>
            </TouchableOpacity>
          </View> : null
        }

        <TouchableOpacity
          onPress={this.onClearCookies}
        >
          <Text style={styles.button} >Clear Cookies</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 30,
    borderWidth: 1,
    margin: 10,
    color: 'blue',
    textAlign: 'center',
    padding: 10,
  }
});
