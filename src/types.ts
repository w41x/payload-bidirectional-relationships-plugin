import {
    ArrayField,
    CollectionAfterDeleteHook,
    Field,
    GeneratedTypes,
    SingleRelationshipField,
    TypeWithID
} from 'payload'

export type valueOf<Type> = Type[keyof Type]

export type RelatableCollection<G extends GeneratedTypes> = Omit<G['collectionsUntyped'], 'payload-preferences' | 'payload-migrations'>

export type RelationList = Record<string, any>[]

export type RelationValue<G extends GeneratedTypes, C extends keyof RelatableCollection<G>> =
    (string | number | null)
    | (RelatableCollection<G>[C] & TypeWithID)

export type Anchor<G extends GeneratedTypes> = {
    [C in keyof RelatableCollection<G> & string]: valueOf<{
        [L in keyof RelatableCollection<G>[C] & string]: RelatableCollection<G>[C][L] extends any ? valueOf<{
            [F in keyof RelatableCollection<G>[C][L][any] & string]: RelatableCollection<G>[C][L][any][F] extends RelationValue<G, keyof RelatableCollection<G>> ? {
                literal: `${C}.${L}.${F}`
                struct: {
                    collection: C
                    list: L
                    field: F
                }
            } : never
        }> : never
    }>
}

export type Vertex<G extends GeneratedTypes> = {
    anchor: valueOf<Anchor<G>>['literal']
    listOptions?: Omit<ArrayField, 'name' | 'type' | 'fields'>
    fieldOptions?: Pick<SingleRelationshipField, 'label'> // _ToDo: change to Omit
}

export type RelationConfig<G extends GeneratedTypes> = {
    vertexA: Vertex<G>
    vertexB: Vertex<G>
    relationMeta: Field[]
}

export type RelationDirection = 'A->B' | 'B->A'

export type DirectedRelation<G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection> = {
    here: (valueOf<Anchor<G>> & { 'literal': Config[Arrow extends 'A->B' ? 'vertexA' : 'vertexB'] })['struct'],
    there: (valueOf<Anchor<G>> & { 'literal': Config[Arrow extends 'A->B' ? 'vertexB' : 'vertexA'] })['struct'],
}

export type BiDirectionalRelationship<G extends GeneratedTypes, Config extends RelationConfig<G>> = {
    config: Config
    anchors: { [Arrow in RelationDirection as DirectedRelation<G, Config, Arrow>['here']['collection']]: ArrayField }
    hooks: { [Arrow in RelationDirection as DirectedRelation<G, Config, Arrow>['here']['collection']]: CollectionAfterDeleteHook }
}