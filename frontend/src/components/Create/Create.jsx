import { useState } from "react";
import { Box, Button, Card, CardContent, CardCover, Grid } from "@mui/joy";
import { combine, sharedClasses } from "../styles";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from "@aws-sdk/client-cognito-identity";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const classes = {
  upload: { height: 80, width: 80, borderRadius: "50%", fontSize: 20 },
  button: { opacity: 0.5, fontSize: 20 },
  buttonGroup: {
    width: "100%",
    position: "absolute",
    margin: "auto",
    bottom: 0,
  },
};

const Create = () => {
  const user = useSelector((state) => state.app.user);
  const [videoSrc, setVideoSrc] = useState(null);
  const [file, setFile] = useState(null);
  const region = import.meta.env.VITE_REGION;

  const getAWSCredentials = async (idToken, identityPoolId) => {
    try {
      const login = `cognito-idp.${region}.amazonaws.com/${
        import.meta.env.VITE_USER_POOL_ID
      }`;

      const cognitoIdentityClient = new CognitoIdentityClient({
        region: region,
      });

      const identityIdCommand = new GetIdCommand({
        IdentityPoolId: identityPoolId,
        Logins: { [login]: idToken },
      });
      const identityIdResponse = await cognitoIdentityClient.send(
        identityIdCommand
      );

      const credentialsCommand = new GetCredentialsForIdentityCommand({
        IdentityId: identityIdResponse.IdentityId,
        Logins: { [login]: idToken },
      });
      const credentialsResponse = await cognitoIdentityClient.send(
        credentialsCommand
      );
      return credentialsResponse;
    } catch (error) {
      console.error("Error occurred in getAWSCredentials:", error);
      throw error;
    }
  };

  const uploadToS3 = async (
    awsCredentials,
    bucketName,
    filePath,
    fileContent
  ) => {
    try {
      const s3Client = new S3Client({
        region: region,
        credentials: {
          accessKeyId: awsCredentials.AccessKeyId,
          secretAccessKey: awsCredentials.SecretKey,
          sessionToken: awsCredentials.SessionToken,
        },
      });

      const putObjectCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        Body: fileContent,
      });
      
      const response = await s3Client.send(putObjectCommand);
      console.log("File uploaded successfully:", response);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
      setFile(file);
    }
  };

  const handlePublish = async () => {
    // const userId = user.profile.sub;
    const contentId = uuidv4();
    const bucket = import.meta.env.VITE_CONTENT_STORAGE_BUCKET;
    const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID;

    try {
      const idToken = user.idToken;

      // Replace with your actual Identity Pool ID
      const awsCredentials = await getAWSCredentials(idToken, identityPoolId);

      // Replace with your actual bucket name and file details
      const filePath = `${awsCredentials.IdentityId}/${contentId}.mp4`;
      const fileContent = await file.arrayBuffer();

      await uploadToS3(
        awsCredentials.Credentials,
        bucket,
        filePath,
        fileContent
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card sx={sharedClasses.card}>
      <CardCover>
        <video key={videoSrc} autoPlay loop muted>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </CardCover>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          {videoSrc == null ? (
            <Button
              variant="solid"
              color="neutral"
              component="label"
              sx={combine(sharedClasses.centerInParent, classes.upload)}
            >
              Upload
              <input
                id="upload-button"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: "none" }}
              />
            </Button>
          ) : (
            <Grid container sx={classes.buttonGroup}>
              <Grid xs={6}>
                <Button
                  fullWidth
                  variant="solid"
                  color="danger"
                  onClick={() => setVideoSrc(null)}
                  sx={classes.button}
                >
                  Discard
                </Button>
              </Grid>
              <Grid xs={6}>
                <Button
                  fullWidth
                  variant="solid"
                  color="success"
                  onClick={handlePublish}
                  sx={classes.button}
                >
                  Publish
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Create;
