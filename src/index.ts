import type { GraphQLClient } from "@shopify/graphql-client";
import type { Fields, RemoteTypeCrud, OrmSchema, OrmSchemaConfig } from "./types";
import { MetaObjectRemoteSchemaCrud } from "./schemaHandler/metaobject";
type ShopifyORM = {
    metaobject: (schema: OrmSchema) => RemoteTypeCrud<OrmSchema>;
}
export function shopifyORM(client: GraphQLClient): ShopifyORM {
    return {
        metaobject: (schema: OrmSchema) => {
            const handler = new MetaObjectRemoteSchemaCrud({
                client,
                schema
            });
            return handler;
        }
    }
}
type OrmSchemaWithColumns = OrmSchema;
export function metaobject(name: string, fields: Fields, configs: OrmSchemaConfig): OrmSchemaWithColumns {
    return {
        ...configs,
        type: 'shopify_metaobject',
        name,
        fields
    }
}