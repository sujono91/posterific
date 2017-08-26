import React, { Component } from 'react';
import { Image, View, StyleSheet, Text, ToastAndroid } from 'react-native';
import { Container, Content, Header, Left, Button, Icon, Body, Title } from 'native-base';
import PosterModel from '../Model/PosterModel';
import AccountKit from 'react-native-facebook-account-kit';

export default class CheckoutScreen extends React.Component {

  static propTypes = {
    poster: React.PropTypes.instanceOf(PosterModel).isRequired,
  };

  static defaultProps = {
    poster: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      poster: this.props.poster,
      authToken: null,
      loggedAccount: null
    };
  }

  componentWillMount() {
    AccountKit.getCurrentAccessToken()
      .then((token) => {
        if (token) {
          AccountKit.getCurrentAccount()
          .then((account) => {
            this.setState({
              authToken: token,
              loggedAccount: account
            });
            this.logUserPurchase();
          });
        } else {
          console.log('No Account Logged In');
        }
      }).catch((e) => console.log('Access Token Request Failed', e));
  }

  loginWithEmail() {
    AccountKit.loginWithEmail()
      .then((token) => {
        this.onLoginSuccess(token);
      }).catch((e) => {
        this.onLoginError(e);
      });
  }

  onLoginSuccess(token) {
    if(!token) {
      console.warn('User canceled login');
      this.setState({});
    } else {
      AccountKit.getCurrentAccount()
        .then((account) => {
          this.setState({
            authToken: token,
            loggedAccount: account
          });
          console.log('user already logged in, completing purchase');
          this.logUserPurchase();
        });
    }
  }

  onLoginError(e) {
    console.log('Failed to login', e);
  }

  render() {
    return (
      <Image
        resizeMode="cover"
        source={require('./../assets/images/login-splash-bg.jpg')}
        style={styles.splashContainer}
      >
        <Container>
          <Header style={{ backgroundColor: '#3770CC' }}>
            <Left>
              <Button transparent onPress={
                () => {
                  this.props.navigator.pop()
                }
              }>
                <Icon name='md-arrow-round-back' />
              </Button>
            </Left>
            <Body>
              <Title style={{ fontSize: 15 }}>Checkout</Title>
            </Body>
          </Header>
          <Content contentContainerStyle={styles.contentContainer}>
            <View style={styles.imageTextWrapper}>
              <View style={styles.congratsWrapper}>
                <Text style={[styles.congrats]}>Thank You!</Text>
              </View>
              <View style={styles.imgWrapper}>
                <Image
                  resizeMode="contain"
                  style={styles.img}
                  source={{ uri: this.state.poster.thumbnailUri }}
                />
              </View>
            </View>

            <Button
              info
              iconRight
              block
              rounded
              style={{ margin: 10 }}
              onPress={() => {
                this.loginWithEmail();
              }}
            >
              <Text style={[styles.btnText]}>Buy Now</Text>
            </Button>

          </Content>
        </Container>
      </Image>
    )
  }

  logUserPurchase() {
    // assume that the "transaction" succeeded and the purchase was made
    ToastAndroid.showWithGravity("Your purchase was successful", ToastAndroid.LONG, ToastAndroid.CENTER);
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 10,
  },

  congratsWrapper: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  congrats: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  imgWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  img: {
    width: 300,
    height: 300,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

});
