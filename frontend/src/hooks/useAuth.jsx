import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { setUser } from "../components/App/appSlice";

export const useRefreshToken = () => {
  const user = useSelector((state) => state.app.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshToken = async () => {
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
      const expiresIn = user.profile.exp - Date.now() / 1000 - 60 * 2;

      if (expiresIn > 0) {
        setTimeout(async () => {
          await refreshToken();
        }, expiresIn);
      } else {
        await refreshToken();
      }
    };

    if (user) refreshBeforeExpiry();
  }, [user]);
};
