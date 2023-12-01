import type { OrmSchema } from "../../../types";
import type { FieldDefinition, MetaObjectDefinition, MetaObjectDefinitionUpdateInput, } from "../../../field-types";
import { Metafield } from "../../../field-types";
import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query';

export function convertToMetaObjectDefinition(inputSchema: OrmSchema): MetaObjectDefinition {
    const fieldKeys = Object.keys(inputSchema.fields);
    return {
        capabilities: inputSchema.capabilities,
        type: inputSchema.name,
        access: inputSchema.access,
        displayNameKey: inputSchema?.displayNameKey,
        fieldDefinitions: fieldKeys.map((fieldKey: string) => {
            const field = inputSchema.fields[fieldKey];
            return {
                key: fieldKey,
                name: field.name,
                type: field.type,
            } as FieldDefinition;
        })
    };
}

export function getMetaObjectFieldsQuery(
    schema: OrmSchema,
) {
    const fieldKeys = Object.keys(schema.fields);

    const fields = fieldKeys.reduce((acc, fieldKey) => {
        acc[fieldKey] = {
            __aliasFor: 'field',
            __args: {
                key: fieldKey
            },
            value: true
        };
        return acc;
    }
        , {} as any);
    return fields;
}
export type PageInfo = {
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
}
export function getMetaObjectsListQuery(
    schema: OrmSchema,
) {
    const fields = getMetaObjectFieldsQuery(schema);
    const query = jsonToGraphQLQuery({
        query: {
            __name: 'metaobjects',
            __variables: {
                type: 'String!',
                first: 'Int!',
                after: 'String',
            },
            metaobjects: {
                __args: {
                    first: new VariableType('first'),
                    type: new VariableType('type'),
                    after: new VariableType('after'),
                },
                edges: {
                    node: {
                        id: true,
                        ...fields,
                    }
                },
                pageInfo: {
                    endCursor: true,
                    hasNextPage: true,
                    hasPreviousPage: true,
                    startCursor: true,
                }
            }
        }
    }, {
        pretty: true
    });
    return query;
}

export function getMetaObjectItemQuery(
    schema: OrmSchema,
) {
    const fields = getMetaObjectFieldsQuery(schema);
    const query = jsonToGraphQLQuery({
        query: {
            __name: 'metaobject',
            __variables: {
                id: 'ID!',
            },
            metaobject: {
                __args: {
                    id: new VariableType('id'),
                },
                id: true,
                ...fields,
            }
        }
    }, {
        pretty: true
    });
    return query;
}

export function getCreateMetaObjectMutation(
    schema: OrmSchema,
): string {
    const fields = getMetaObjectFieldsQuery(schema);
    const query = jsonToGraphQLQuery({
        mutation: {
            __name: 'CreateMetaObject',
            __variables: {
                metaobject: 'MetaobjectCreateInput!',
            },
            metaobjectCreate: {
                __args: {
                    metaobject: new VariableType('metaobject'),
                },
                metaobject: {
                    id: true,
                    ...fields,
                },
                userErrors: {
                    code: true,
                    elementIndex: true,
                    elementKey: true,
                    field: true,
                    message: true,
                },
            },
        },
    },
        {
            pretty: true
        });
    return query;
}
export function getUpdateMetaObjectMutation(
    schema: OrmSchema,
): string {
    const fields = getMetaObjectFieldsQuery(schema);
    const query = jsonToGraphQLQuery({
        mutation: {
            __name: 'UpdateMetaObject',
            __variables: {
                metaobject: 'MetaobjectUpdateInput!',
                id: 'ID!',
            },
            metaobjectUpdate: {
                __args: {
                    metaobject: new VariableType('metaobject'),
                    id: new VariableType('id'),
                },
                metaobject: {
                    id: true,
                    ...fields,
                },
                userErrors: {
                    code: true,
                    elementIndex: true,
                    elementKey: true,
                    field: true,
                    message: true,
                },
            },
        },
    },
        {
            pretty: true
        });
    return query;
}
export const META_OBJECT_DELETE_MUTATION = `#graphql
mutation metaobjectDelete($id: ID!) {
    metaobjectDelete(id: $id) {
      deletedId
      userErrors {
        code
        elementIndex
        elementKey
        field
        message
      }
    }
}`;


export function convertToMetaObjectInput(
    schema: OrmSchema,
    data: any
): {
    type: string;
    capabilities: any;
} {
    const fieldsKeys = Object.keys(schema.fields);
    const fields = fieldsKeys.map((fieldKey: string) => {
        // const field = schema.fields[fieldKey];
        const value = data[fieldKey];
        if (value)
            return {
                key: fieldKey,
                value: typeof value === 'object' ? JSON.stringify(value) : value
            } as unknown as Metafield;
        return null;
    });


    return {
        type: schema.name,
        fields
    };
}
export function getSchemaDefaultValue(
    schema: MetaObjectSchemaType,
) {
    const fields = schema.fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }
        , {} as any);
    return fields;
}

const normalizeType = (type: string | { name: string }): string =>
    typeof type === 'string' ? type : type.name;

// Helper to compare non-array fields
const compareFields = (field1: any, field2: any): boolean => {
    if (field1 && field2) {
        return JSON.stringify(field1) === JSON.stringify(field2);
    }
    return field1 === field2;
};

export function findSchemaChanges(dbObject: MetaObjectDefinition, localObject: MetaObjectDefinition): MetaObjectDefinitionUpdateInput | null {
    const localFields = new Map(localObject.fieldDefinitions.map(field => [field.key ?? field.name, field]));
    const dbFields = new Map(dbObject.fieldDefinitions.map(field => [field.key ?? field.name, field]));
    let hasChanges = false;
    // const fieldDefinitions: Array<FieldDefinitionChange> = [];
    let changes: MetaObjectDefinitionUpdateInput = {

        fieldDefinitions: []
    };


    // Check for added, updated, or deleted fields
    localFields.forEach((localField, key) => {
        const dbField = dbFields.get(key);
        if (!dbField) {

            changes?.fieldDefinitions.push({
                create: localField
            });
        } else if (normalizeType(localField.name) !== normalizeType(dbField.name) || normalizeType(localField.type) !== normalizeType(dbField.type)) {
            changes?.fieldDefinitions.push({ update: localField });
        }
    });
    dbFields.forEach((_, key) => {
        if (!localFields.has(key)) {
            changes?.fieldDefinitions.push({
                delete: {
                    key
                }
            });
        }
    });
    // Check other properties like access, capabilities, displayNameKey, etc.
    ['access', 'capabilities', 'displayNameKey'].forEach(prop => {
        if (!compareFields(dbObject[prop as keyof MetaObjectDefinition], localObject[prop as keyof MetaObjectDefinition])) {
            hasChanges = true;
            changes[prop] = localObject[prop as keyof MetaObjectDefinition];
        }
    });
    if (changes?.fieldDefinitions.length > 0) {
        hasChanges = true;
    }
    if (hasChanges) {
        return changes;
    }
    return null;
}

export function convertToModel(
    schema: OrmSchema,
    data: any
) {
    const fields = Object.keys(data);
    let item = {
        id: data.id
    }
    fields.forEach((fieldKey: string) => {
        const field = schema.fields[fieldKey];
        if (field) {
            item[fieldKey] = data[fieldKey]?.value;
            const isObject = field.type === 'json';
            if (item[fieldKey] && isObject) {
                item[fieldKey] = JSON.parse(item[fieldKey]);
            }
        }
    });
    return item;
}
