import type { GraphQLClient } from "@shopify/graphql-client";
import type { CapabilitiesDefinition, Metafield } from "../field-types";

export type OrmRemoteType = 'shopify_metaobject' | 'payment_customization' | 'delivery_customization';
type AdminAccess =
    | "PRIVATE"
    | "MERCHANT_READ"
    | "MERCHANT_READ_WRITE"
    | "PUBLIC_READ"
    | "PUBLIC_READ_WRITE";
export interface AccessDefinition {
    admin: AdminAccess;
    storefront: "PUBLIC_READ" | 'NONE'; // You can add more types if needed
}

export type Field = {
    type: Metafield['type']
    name: string;
    description?: string;
    defaultValue?: any;
}
export type Fields = Record<string, Field>;
export type OrmSchemaConfig = {
    capabilities: CapabilitiesDefinition
    displayNameKey?: string;
    access: AccessDefinition;
    admin_access: AdminAccess;
}
export type OrmSchema = OrmSchemaConfig & {
    type: OrmRemoteType;
    name: string;
    fields: Fields;
}
export type DbHandlerCrudInput = {
    // schema: OrmSchema;
}
type IdOrHandle = { id: string } | { handle: string };

export type DbHandlerGetCrudInput = DbHandlerCrudInput & IdOrHandle;

export type DbHandlerDeleteCrudInput = DbHandlerCrudInput & IdOrHandle;


export type DbHandlerUpdateCrudInput = DbHandlerCrudInput & {
    data: any;
} & IdOrHandle

export type DbHandlerCreateCrudInput = DbHandlerCrudInput & {
    data: any;
}

export type DbHandlerCrudError = {
    message: string;
    code: string;
}
export type MigrateSuccess = {
    success: true;
    message: string;
}
export type MigrateError = {
    success: false;
    message: string;
}
export type MigrateResult = MigrateSuccess | MigrateError;
export type DbHandlerConfig = {
    client: GraphQLClient;
    schema: OrmSchema;
}
export type DbHandlerListInput = {
    first?: number;
    after?: string;
    type?: string;
}
export type DeleteResult = {
    success: boolean;
    message: string;

}
export abstract class RemoteTypeCrud<Item> {
    abstract migrate(): Promise<MigrateResult>;
    abstract get(input: DbHandlerGetCrudInput): Promise<Item | DbHandlerCrudError>;
    abstract list(input: DbHandlerListInput): Promise<Item[] | DbHandlerCrudError>;
    abstract create(input: DbHandlerCreateCrudInput): Promise<Item | DbHandlerCrudError>;
    abstract update(input: DbHandlerUpdateCrudInput): Promise<Item | DbHandlerCrudError>;
    abstract delete(input: DbHandlerDeleteCrudInput): Promise<DeleteResult>;
}
export type RemoteDbHandler<Item> = Record<OrmRemoteType, RemoteTypeCrud<Item>>