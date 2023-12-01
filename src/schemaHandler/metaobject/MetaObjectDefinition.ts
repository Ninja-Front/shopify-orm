import type { ClientResponse, GraphQLClient } from '@shopify/graphql-client';
import type { MetaObjectDefinition, MetaObjectDefinitionUpdateInput } from '../../../field-types';
import { runQql } from './client';

const CHECK_EXISTING_META_OBJECT_DEFINITION = `#graphql
query metaobjectDefinition($type: String = "") {
  metaobjectDefinitionByType(type: $type) {
    id
    type
    access {
      admin
      storefront
    }
    capabilities {
      publishable {
        enabled
      }
    }
    displayNameKey
    fieldDefinitions {
      key
      name
      type{
        name
        # category
      }
    }
  }
}
`;
type MetaObjectDefinitionResponse = {
  metaobjectDefinitionByType: MetaObjectDefinition
}
const CREATE_META_OBJECT_DEFINITION = `#graphql
mutation CreateMetaObjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition {
        id
      }
      userErrors {
        code
        elementIndex
        elementKey
        field
        message
      }
    }
  }`;
type UserError = {
  code: string
  elementIndex: number
  elementKey: string
  field: string
  message: string
};
type CreateResponse = {
  metaobjectDefinitionCreate: {
    metaobjectDefinition: {
      id: string
    }
    userErrors: UserError[]
  }

}
const UPDATE_META_OBJECT_DEFINITION = `#graphql
mutation UpdateMetaObjectDefinition($definition: MetaobjectDefinitionUpdateInput!,$id:ID!) {
  metaobjectDefinitionUpdate(definition: $definition,id:$id) {
    metaobjectDefinition {
      id
    }
    userErrors {
      code
      elementIndex
      elementKey
      field
      message
    }
  }
}`;
type UpdateResponse = {
  metaobjectDefinitionUpdate: {
    metaobjectDefinition: {
      id: string
    }
    userErrors: UserError[]
  }


}
export function getMetaObjectDefinition(
  client: GraphQLClient,
  type: string
): Promise<ClientResponse<MetaObjectDefinitionResponse>> {
  return runQql<MetaObjectDefinitionResponse>({
    client,
    query: CHECK_EXISTING_META_OBJECT_DEFINITION,
    variables: {
      type
    }
  });

}
export function createMetaObjectDefinition(
  client: GraphQLClient,
  metaObjectDefinition: MetaObjectDefinition
): Promise<ClientResponse<CreateResponse>> {
  return runQql<CreateResponse>({
    client,
    query: CREATE_META_OBJECT_DEFINITION,
    variables: {
      definition: metaObjectDefinition
    }
  });


}
export function updateMetaObjectDefinition(
  client: GraphQLClient,
  { definition, id }: { definition: MetaObjectDefinitionUpdateInput, id: string }
): Promise<ClientResponse<UpdateResponse>> {
  return runQql<UpdateResponse>({
    client,
    query: UPDATE_META_OBJECT_DEFINITION,
    variables: {
      definition: definition,
      id
    }
  });
}