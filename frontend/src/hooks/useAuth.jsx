import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  NotAuthorizedException,
} from "@aws-sdk/client-cognito-identity-provider";
import { setUser } from "../components/App/appSlice";
import { utils } from "../components";

export const useManageTokens = () => {
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const updateToken = async () => {
      const client = new CognitoIdentityProviderClient({
        region: import.meta.env.VITE_REGION,
      });
      const command = new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: user.refreshToken,
        },
      });
      const response = await client.send(command);
      const data = response.AuthenticationResult;
      const _user = {
        profile: JSON.parse(atob(data.IdToken.split(".")[1])),
        idToken: data.IdToken,
        accessToken: data.AccessToken,
        refreshToken: user.refreshToken,
      };
      dispatch(setUser(_user));
    };

    const refreshBeforeExpiry = async () => {
      try {
        const expiresIn =
          utils.getProperty(user.idToken, "exp") * 1000 -
          Date.now() -
          60000 * 2;

        if (expiresIn > 0) {
          setTimeout(async () => {
            await updateToken();
          }, expiresIn);
        } else {
          await updateToken();
        }
      } catch (error) {
        if (error instanceof NotAuthorizedException) {
          dispatch(setUser(null));
        }
      }
    };

    if (user) refreshBeforeExpiry();
  }, [user]);
};
