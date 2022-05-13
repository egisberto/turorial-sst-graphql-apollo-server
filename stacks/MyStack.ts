import { Stack, StackProps, App, GraphQLApi } from "@serverless-stack/resources";

export default class MyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the GraphQL API
    const api = new GraphQLApi(this, "ApolloApi", {
      server: "backend/lambda.handler"
    });

    // Show the API endpoint in output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}