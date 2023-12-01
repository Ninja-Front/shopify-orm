
type MetafieldReference =
    | CollectionReference
    | FileReference
    | MetaobjectReference
    | MixedReference
    | PageReference
    | ProductReference
    | VariantReference;
type MetafieldListReference =
    | ListCollectionReference
    | ListColor
    | ListDate
    | ListDateTime
    | ListDimension
    | ListFileReference
    | ListMetaobjectReference
    | ListMixedReference
    | ListNumberInteger
    | ListNumberDecimal
    | ListPageReference
    | ListProductReference
    | ListRating
    | ListSingleLineTextField
    | ListURL
    | ListVariantReference
    | ListVolume
    | ListWeight;
export type Metafield =
    | BooleanMetafield
    | ColorMetafield
    | DateMetafield
    | DateTimeMetafield
    | DimensionMetafield
    | JSONMetafield
    | MoneyMetafield
    | MultiLineTextField
    | NumberDecimalMetafield
    | NumberIntegerMetafield
    | RatingMetafield
    | RichTextField
    | SingleLineTextField
    | UrlMetafield
    | VolumeMetafield
    | WeightMetafield
    | MetafieldReference
    | MetafieldListReference;



export interface BooleanMetafield {
    type: "boolean";
    value: boolean;
}

export interface ColorMetafield {
    type: "color";
    value: string;
}

export interface DateMetafield {
    type: "date";
    value: string;
}

export interface DateTimeMetafield {
    type: "date_time";
    value: string;
}

export interface DimensionMetafield {
    type: "dimension";
    value: {
        value: number;
        unit: "in" | "ft" | "yd" | "mm" | "cm" | "m";
    };
}

export interface JSONMetafield {
    type: "json";
    value: object | string | number | boolean | null;
}

export interface MoneyMetafield {
    type: "money";
    value: {
        amount: string;
        currency_code: string;
    };
}

export interface MultiLineTextField {
    type: "multi_line_text_field";
    value: string;
}

export interface NumberDecimalMetafield {
    type: "number_decimal";
    value: string;
}

export interface NumberIntegerMetafield {
    type: "number_integer";
    value: number;
}

export interface RatingMetafield {
    type: "rating";
    value: {
        value: string;
        scale_min: string;
        scale_max: string;
    };
}

export interface RichTextField {
    type: "rich_text_field";
    value: {
        type: "root";
        children: any[]; // The structure here can be more detailed based on your needs
    };
}

export interface SingleLineTextField {
    type: "single_line_text_field";
    value: string;
}

export interface UrlMetafield {
    type: "url";
    value: string;
}

export interface VolumeMetafield {
    type: "volume";
    value: {
        value: number;
        unit: "ml" | "cl" | "l" | "m3" | "us_fl_oz" | "us_pt" | "us_qt" | "us_gal" | "imp_fl_oz" | "imp_pt" | "imp_qt" | "imp_gal";
    };
}

export interface WeightMetafield {
    type: "weight";
    value: {
        value: number;
        unit: "oz" | "lb" | "g" | "kg";
    };
}

export interface CollectionReference {
    type: "collection_reference";
    value: string; // e.g., "gid://shopify/Collection/1"
}

export interface FileReference {
    type: "file_reference";
    value: string; // e.g., "gid://shopify/MediaImage/123"
}

export interface MetaobjectReference {
    type: "metaobject_reference";
    value: string; // e.g., "gid://shopify/Metaobject/123"
}

export interface MixedReference {
    type: "mixed_reference";
    value: string; // e.g., "gid://shopify/Metaobject/123"
}

export interface PageReference {
    type: "page_reference";
    value: string; // e.g., "gid://shopify/OnlineStorePage/1"
}

export interface ProductReference {
    type: "product_reference";
    value: string; // e.g., "gid://shopify/Product/1"
}

export interface VariantReference {
    type: "variant_reference";
    value: string; // e.g., "gid://shopify/ProductVariant/1"
}

export interface ListCollectionReference {
    type: "list.collection_reference";
    value: string[];
}

export interface ListColor {
    type: "list.color";
    value: string[];
}

export interface ListDate {
    type: "list.date";
    value: string[];
}

export interface ListDateTime {
    type: "list.date_time";
    value: string[];
}

export interface Dimension {
    value: number;
    unit: "in" | "ft" | "yd" | "mm" | "cm" | "m";
}

export interface ListDimension {
    type: "list.dimension";
    value: Dimension[];
}

export interface ListFileReference {
    type: "list.file_reference";
    value: string[];
}

export interface ListMetaobjectReference {
    type: "list.metaobject_reference";
    value: string[];
}

export interface ListMixedReference {
    type: "list.mixed_reference";
    value: string[];
}

export interface ListNumberInteger {
    type: "list.number_integer";
    value: number[];
}

export interface ListNumberDecimal {
    type: "list.number_decimal";
    value: number[];
}

export interface ListPageReference {
    type: "list.page_reference";
    value: string[];
}

export interface ListProductReference {
    type: "list.product_reference";
    value: string[];
}

export interface Rating {
    value: string;
    scale_min: string;
    scale_max: string;
}

export interface ListRating {
    type: "list.rating";
    value: Rating[];
}

export interface ListSingleLineTextField {
    type: "list.single_line_text_field";
    value: string[];
}

export interface ListURL {
    type: "list.url";
    value: string[];
}

export interface ListVariantReference {
    type: "list.variant_reference";
    value: string[];
}

export interface Volume {
    value: number;
    unit: "ml" | "cl" | "l" | "m3" | "us_fl_oz" | "us_pt" | "us_qt" | "us_gal" | "imp_fl_oz" | "imp_pt" | "imp_qt" | "imp_gal";
}

export interface ListVolume {
    type: "list.volume";
    value: Volume[];
}

export interface Weight {
    value: number;
    unit: "oz" | "lb" | "g" | "kg";
}

export interface ListWeight {
    type: "list.weight";
    value: Weight[];
}
export type AdminAccess =
    | "PRIVATE"
    | "MERCHANT_READ"
    | "MERCHANT_READ_WRITE"
    | "PUBLIC_READ"
    | "PUBLIC_READ_WRITE";
export interface AccessDefinition {
    admin: AdminAccess;
    storefront: "PUBLIC_READ" | 'NONE'; // You can add more types if needed
}
export interface PublishableCapabilities {
    enabled: boolean;
}

export interface CapabilitiesDefinition {
    publishable: PublishableCapabilities;
}
export type TextValidation = {
    type: 'minimum_length' | 'maximum_length' | 'regular_expression';
    value: string;
};

export type UrlValidation = {
    type: 'allowed_domains';
    value: string;
};

export type ChoiceValidation = {
    type: 'choices';
    value: string;
};

export type FileTypeValidation = {
    type: 'file_type_options';
    value: ('Image' | 'Video');
};

export type NumericValidation = {
    type: 'maximum_precision' | 'minimum_integer' | 'maximum_integer' | 'minimum_decimal' | 'maximum_decimal';
    value: string;
};

export type DateValidation = {
    type: 'minimum_date' | 'maximum_date' | 'minimum_datetime' | 'maximum_datetime';
    value: string;  // ISO 8601 format
};

export type WeightValidation = {
    type: 'minimum_weight' | 'maximum_weight';
    value: string;
};

export type VolumeValidation = {
    type: 'minimum_volume' | 'maximum_volume';
    value: string;
};

export type DimensionValidation = {
    type: 'minimum_dimension' | 'maximum_dimension';
    value: string;
};

export type ReferenceValidation = {
    type: 'metaobject_definition' | 'multiple_metaobject_definitions';
    value: string;  // array of metaobject definitions
};

export type JsonValidation = {
    type: 'json_schema';
    value: string;  // You might want to use a specific schema export type if you have one defined
};

export type Validation =
    TextValidation | UrlValidation | ChoiceValidation | FileTypeValidation | NumericValidation |
    DateValidation | WeightValidation | VolumeValidation | DimensionValidation |
    ReferenceValidation | JsonValidation;

export interface MetaObjectDefinition {
    id?: string; // Keeping 'id' optional since it's not present in the provided object
    type: string;
    access: AccessDefinition;
    capabilities: CapabilitiesDefinition;
    fieldDefinitions: FieldDefinition[];
    displayNameKey?: string;
}
export type FieldDefinitionChange = {
    create?: FieldDefinition;
    update?: FieldDefinition;
    delete?: { key: string };
};
export type SchemaChanges = {
    fieldDefinitions: FieldDefinitionChange[];
}
export type MetaObjectDefinitionUpdateInput = {
    type?: string;
    access?: AccessDefinition;
    capabilities?: CapabilitiesDefinition;
    displayNameKey?: string;
} & SchemaChanges

export interface FieldDefinition {
    key: string;
    name: string; // Adding 'name' as it's present in the provided object
    type: Metafield["type"];
    validations?: Validation[];
}