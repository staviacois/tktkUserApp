import FBSDK, {AccessToken, LoginManager, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';

function loginIfNeeded(cbLoginFBOk) {

  const cbError = (error) => {
    console.log(error);
  };

  const cbSuccess = (data) => {
    if (data) {
      cbLoginFBOk(data);
    } else {
      const cbSuccess = (result) => {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then(cbLoginFBOk, cbError);
        }
      };
      LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_location']).then(cbSuccess, cbError);
    }

  };

  AccessToken.getCurrentAccessToken().then(cbSuccess, cbError);
}

function getUserInfos(cbSuccess, cbError) {

  new GraphRequestManager().addRequest(new GraphRequest('/me', {
    httpMethod: 'GET',
    version: 'v2.8',
    parameters: {
      fields: {
        string: 'id,email,location,first_name,last_name'
      }
    }
  }, (error, result) => {
    if (error) {
      cbError(error);
    } else {

      const cbSuccess2 = (res) => {

        console.log("1");

        new GraphRequestManager().addRequest(new GraphRequest('/' + result["location"].id, {
          httpMethod: 'GET',
          version: 'v2.8',
          parameters: {
            fields: {
              string: 'location'
            }
          }
        }, (error0, result0) => {
          if (error0) {
            cbError(error0);
          } else {
            const data = {
              accessToken: res.accessToken,
              infosUser: {
                lastname: result["last_name"],
                firstname: result["first_name"],
                email: result["email"],
                city: result0["location"].city
              }
            }
            cbSuccess(data);
          }
        })).start();
      };

      AccessToken.getCurrentAccessToken().then(cbSuccess2, cbError);
    }
  })).start();

}

module.exports = {
  loginIfNeeded,
  getUserInfos
}
