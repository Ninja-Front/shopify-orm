import type { DbHandlerConfig, DbHandlerCreateCrudInput, DbHandlerDeleteCrudInput, DbHandlerGetCrudInput, DbHandlerListInput, DbHandlerUpdateCrudInput, DeleteResult, MigrateResult } from "../../../types";
import { RemoteTypeCrud } from "../../../types";
import { createMetaObjectDefinition, getMetaObjectDefinition, updateMetaObjectDefinition } from "./MetaObjectDefinition";
import { runQql } from "./client";
import type { PageInfo } from "./helper";
import { META_OBJECT_DELETE_MUTATION, convertToMetaObjectDefinition, convertToMetaObjectInput, convertToModel, findSchemaChanges, getCreateMetaObjectMutation, getMetaObjectItemQuery, getMetaObjectsListQuery, getUpdateMetaObjectMutation } from "./helper";

// complete this code 
export class MetaObjectRemoteSchemaCrud<Item> extends RemoteTypeCrud<Item> {

    constructor(config: DbHandlerConfig) {
        super();
        this.config = config;
    }
    async migrate(): Promise<MigrateResult> {
        const metaObjectDefinition = convertToMetaObjectDefinition(this.config.schema);
        const remoteDefinition = await getMetaObjectDefinition(this.config.client, this.config.schema.name);
        const currentDefinition = remoteDefinition?.data?.metaobjectDefinitionByType;
        if (currentDefinition !== null && currentDefinition !== undefined) {
            const changes = findSchemaChanges(currentDefinition, metaObjectDefinition);
            if (changes !== null) {
                const updatedResponse = await updateMetaObjectDefinition(this.config.client, {
                    definition: changes,
                    id: currentDefinition.id
                });
                if (updatedResponse?.data?.metaobjectDefinitionUpdate?.metaobjectDefinition?.id) {
                    return { success: true, message: 'Definition Updated' };
                } else {
                    return { success: false, message: 'Definition Not Updated' };
                }


            } else {
                return { success: true, message: 'Definition is up to date' };
            }
        } else {
            const createdResponse = await createMetaObjectDefinition(this.config.client, metaObjectDefinition);
            if (createdResponse?.data?.metaobjectDefinitionCreate?.metaobjectDefinition?.id) {
                return { success: true, message: 'Definition Created' };
            } else {
                return { success: false, message: 'Definition Not Created' };
            }
        }

    }

    async get(input: DbHandlerGetCrudInput): Promise<Item> {

        const query = getMetaObjectItemQuery(this.config.schema);
        const response = await runQql({
            client: this.config.client,
            query,
            variables: {
                id: input.id
            }
        });
        const item = convertToModel(this.config.schema, response?.data?.metaobject);
        return item;

    }

    async list(input: DbHandlerListInput): Promise<{
        items: Item[];
        pageInfo: PageInfo;
    } | DbHandlerCrudError> {
        try {
            const query = getMetaObjectsListQuery(this.config.schema);
            const variables = {
                type: this.config.schema.name,
                first: input.first || 10,
                after: input.after
            }
            const response = await runQql({
                client: this.config.client,
                query,
                variables
            });
            const items = response?.data?.metaobjects?.edges.map((item: any) => {
                return convertToModel(this.config.schema, item?.node);
            });
            return {
                items,
                pageInfo: response?.data?.metaobjects?.pageInfo

            };

        } catch (error) {
            return { message: error.message, code: 'LIST_ERROR' };
        }
    }
    async create(input: DbHandlerCreateCrudInput): Promise<Item> {
        const query = getCreateMetaObjectMutation(this.config.schema);
        const metaobject = convertToMetaObjectInput(this.config.schema, input.data);
        const createItem = await runQql({
            client: this.config.client,
            query,
            variables: {
                metaobject
            }
        })
        return convertToModel(this.config.schema, createItem?.data?.metaobjectCreate?.metaobject);

    }

    async update(input: DbHandlerUpdateCrudInput): Promise<Item> {
        const metaobject = convertToMetaObjectInput(this.config.schema, input.data);
        const query = getUpdateMetaObjectMutation(this.config.schema);
        console.log(query);

        const updateItem = await runQql({
            client: this.config.client,
            query,
            variables: {
                id: input.id,
                metaobject: {
                    fields: metaobject.fields
                }
            }
        })
        return convertToModel(this.config.schema, updateItem?.data?.metaobjectUpdate?.metaobject);

    }

    // Implement the 'delete' method
    async delete(input: DbHandlerDeleteCrudInput): Promise<DeleteResult> {
        const response = await runQql({
            client: this.config.client,
            query: META_OBJECT_DELETE_MUTATION,
            variables: {
                id: input.id
            }
        });
        return { success: true, message: 'Item deleted successfully' };

    }
}