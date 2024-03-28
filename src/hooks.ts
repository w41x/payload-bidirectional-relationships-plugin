import {GeneratedTypes} from 'payload'
import {CollectionAfterDeleteHook, FieldHook, TypeWithID} from 'payload/types'
import {DirectedRelation, RelatableCollection, RelationConfig, RelationDirection, RelationList} from './types.js'
import {couple, entriesEqual, extractDirectedRelation, getId, getList} from './helpers.js'

export const afterListChange = <G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection>(config: Config, direction: Arrow): FieldHook<RelatableCollection<G>[DirectedRelation<G, Config, Arrow>['here']['collection']] & TypeWithID, RelationList | null> => async ({
                                                                                                                                                                                                                                                                                                            originalDoc,
                                                                                                                                                                                                                                                                                                            value,
                                                                                                                                                                                                                                                                                                            previousValue,
                                                                                                                                                                                                                                                                                                            req,
                                                                                                                                                                                                                                                                                                            context
                                                                                                                                                                                                                                                                                                        }) => {
    if (value && originalDoc) {
        const {here: {field}} = extractDirectedRelation<G, Config, Arrow>(config, direction)
        const newIds = value.map(entry => getId(entry[field])).filter(id => id) as string[]
        let deletedEntries = previousValue?.filter(oldEntry => !newIds.includes(getId(oldEntry[field]) ?? ''))
        if (context.deletionCameFrom)
            deletedEntries = deletedEntries?.filter(entry => getId(entry[field]) != context.deletionCameFrom)
        if (deletedEntries?.length)
            await couple<G, Config, Arrow>(originalDoc, deletedEntries, config, direction, req, 'decoupling', context)
        let changedEntries = value.filter(newEntry => !previousValue?.filter(oldEntry => entriesEqual(newEntry, oldEntry, field)).length)
        if (context.updateCameFrom)
            changedEntries = changedEntries.filter(entry => getId(entry[field]) != context.updateCameFrom)
        if (changedEntries.length)
            await couple<G, Config, Arrow>(originalDoc, changedEntries, config, direction, req, 'recoupling', context)
    }
    return null
}

export const afterDocumentDelete = <G extends GeneratedTypes, Config extends RelationConfig<G>>(config: Config, direction: RelationDirection): CollectionAfterDeleteHook<RelatableCollection<G>[DirectedRelation<G, Config, typeof direction>['here']['collection']] & TypeWithID> => async ({
                                                                                                                                                                                                                                                                                                 doc,
                                                                                                                                                                                                                                                                                                 req,
                                                                                                                                                                                                                                                                                                 context
                                                                                                                                                                                                                                                                                             }) =>
    couple<G, Config, typeof direction>(doc, getList<G, Config, typeof direction>(config, direction, doc), config, direction, req, 'decoupling', {
        ...context,
        deletionCameFrom: doc.id
    })