// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[dynamodb.JavaScript.table.createTableV3]
import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "localhost",
  endpoint: "http://dynamodb-local:8000",
  credentials: {
    accessKeyId: "ACCESS",
    secretAccessKey: "SECRET",
  },
});

export const createVertextTable = async () => {
  const command = new CreateTableCommand({
    TableName: "Vertex",
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });

  const response = await client.send(command);
  console.log(response);
  return response;
};

export const createEdgetTable = async () => {
  const command = new CreateTableCommand({
    TableName: "Edge",
    AttributeDefinitions: [
      {
        AttributeName: "Source",
        AttributeType: "S",
      },
      {
        AttributeName: "Type",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "Source",
        KeyType: "HASH",
      },
      {
        AttributeName: "Type",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });

  const response = await client.send(command);
  console.log(response);
  return response;
};

// createVertextTable();
// createEdgetTable();
