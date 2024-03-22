import {GeneratedTypes} from 'payload'
import {CollectionAfterDeleteHook, FieldHook, TypeWithID} from 'payload/types'
import {DirectedRelation, RelatableCollection, RelationConfig, RelationDirection, RelationList} from './types'
import {couple, deepComparison, extractDirectedRelation, getId, getList} from './helpers'

export const afterListChange = <G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection>(config: Config, direction: Arrow): FieldHook<RelatableCollection<G>[DirectedRelation<G, Config, Arrow>['here']['collection']] & TypeWithID, RelationList | null> => async ({
                                                                                                                                                                                                                                                                                                            originalDoc,
                                                                                                                                                                                                                                                                                                            value,
                                                                                                                                                                                                                                                                                                            previousValue,
                                                                                                                                                                                                                                                                                                            req,
                                                                                                                                                                                                                                                                                                            context
                                                                                                                                                                                                                                                                                                        }) => {
    if (value && originalDoc && value !== previousValue) {
        if (previousValue && deepComparison(value, previousValue)) //no changes
            return null
        const {there} = extractDirectedRelation<G, Config, Arrow>(config, direction)
        const deletedEntries = previousValue
            ?.filter(oldEntry => value
                .filter(newEntry => getId(oldEntry[there.field]) === getId(newEntry[there.field])).length == 0) ?? []
        await couple<G, Config, Arrow>(originalDoc, deletedEntries, config, direction, req, 'decoupling', context)
        await couple<G, Config, Arrow>(originalDoc, value, config, direction, req, 'recoupling', context)
    }
    return null
}

export const afterDocumentDelete = <G extends GeneratedTypes, Config extends RelationConfig<G>>(config: Config, direction: RelationDirection): CollectionAfterDeleteHook<RelatableCollection<G>[DirectedRelation<G, Config, typeof direction>['here']['collection']] & TypeWithID> => async ({
                                                                                                                                                                                                                                                                                                 doc,
                                                                                                                                                                                                                                                                                                 req,
                                                                                                                                                                                                                                                                                                 context
                                                                                                                                                                                                                                                                                             }) =>
    couple<G, Config, typeof direction>(doc, getList<G, Config, typeof direction>(config, direction, doc), config, direction, req, 'decoupling', context)