import { createGraphQLClient } from '@shopify/graphql-client';
import { metaobject, shopifyORM } from '../src';
import type { OrmSchema } from '../types';

const client = createGraphQLClient({
    url: 'https://<shop>.myshopify.com/admin/api/2023-10/graphql.json',
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '<accessToken>',
    },
    retries: 1
});

const db = shopifyORM(client);
const sizeChart: OrmSchema = metaobject('size_chart', {
    name: {
        name: 'name',
        type: 'single_line_text_field',
    },
    config: {
        name: 'config',
        type: 'json'
    },
    products: {
        name: 'products',
        type: 'list.product_reference',
    },
    collections: {
        name: 'collections',
        type: 'list.collection_reference',
    }
},
    {
        displayNameKey: 'name',
        capabilities: {
            publishable: {
                enabled: true
            }
        },
        admin_access: 'PUBLIC_READ_WRITE',
        access: {
            admin: 'PUBLIC_READ_WRITE',
            storefront: 'PUBLIC_READ'
        }
    });
async function main() {

    const sizeChartSchema = db.metaobject(sizeChart);
    const resp = await sizeChartSchema.migrate();
    const createdItems = await sizeChartSchema.create({
        data: {
            name: "Jeans Size Chart",
            config: {
                size: ["S", "M", "L", "XL"],
                waist: ["28", "30", "32", "34"],
            },
        }
    });
    console.log(createdItems);
    // return;
    const items = await sizeChartSchema.list({
        first: 10
    });

    console.log(items);


}
main();