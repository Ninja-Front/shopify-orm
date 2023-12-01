import { ClientResponse } from "@shopify/graphql-client";

export async function runQql<Response>({
    client,
    query,
    variables
}): Promise<ClientResponse<Response>> {
    const resp = await client.request(query, {
        variables
    });

    if (resp.errors) {
        throw resp.errors;
    }
    else {
        return resp;
    }

}