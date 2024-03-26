import {GeneratedTypes, RequestContext} from 'payload'
import {PayloadRequest} from 'payload/types'
import {
    DirectedRelation,
    RelatableCollection,
    RelationConfig, RelationDirection,
    RelationList,
    RelationValue
} from './types'

export const extractDirectedRelation = <G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection>(config: RelationConfig<G>, direction: Arrow): DirectedRelation<G, Config, Arrow> => {
    const split = {
        here: (config[`vertex${direction == 'A->B' ? 'A' : 'B'}`].anchor as string).split('.'),
        there: (config[`vertex${direction == 'A->B' ? 'B' : 'A'}`].anchor as string).split('.')
    }
    return {
        here: {
            collection: split.here[0],
            list: split.here[1],
            field: split.here[2]
        },
        there: {
            collection: split.there[0],
            list: split.there[1],
            field: split.there[2]
        }
    } as DirectedRelation<G, Config, Arrow>
}

export const getId = <G extends GeneratedTypes, C extends keyof RelatableCollection<G>>(entry: RelationValue<G, C> | undefined) =>
    typeof entry == 'string' ? entry : entry ? entry.id as string : undefined

export const getList = <G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection>(config: Config, direction: Arrow, data: Partial<RelatableCollection<G>[DirectedRelation<G, Config, Arrow>['here']['collection']]>) =>
    data[extractDirectedRelation<G, Config, Arrow>(config, direction).here.list] as RelationList

const getRelationMeta = (entry: Record<string | number | symbol, any>, field: string | number | symbol) => {
    const {[field]: relationObject, id, ...relationMeta} = entry
    return relationMeta
}

export const couple = async <G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection>(docHere: RelationValue<G, DirectedRelation<G, Config, Arrow>['here']['collection']>, relationEntries: RelationList, config: Config, direction: Arrow, req: PayloadRequest, mode: 'decoupling' | 'recoupling', context: RequestContext) => {
    const {here, there} = extractDirectedRelation<G, Config, Arrow>(config, direction)
    const docHereId = getId(docHere)
    if (docHereId)
        for (const entryHere of relationEntries) {
            const docThereId = getId(entryHere[here.field])
            if (docThereId) {
                const relationMetaHere = getRelationMeta(entryHere, here.field)
                const newEntryThere = {
                    [there.field]: docHereId,
                    ...relationMetaHere
                }
                try {
                    const entriesThere = (await req.payload.findByID({
                        collection: there.collection as keyof GeneratedTypes['collections'],
                        id: docThereId,
                        depth: 2
                    }) as RelatableCollection<G>[typeof there.collection])[there.list] as RelationList
                    const matches = entriesThere.filter(entryThere => getId(entryThere[there.field]) == docHereId)
                    let updateNeeded = mode == 'decoupling' ? matches.length > 0 : (matches.length != 1 ? true : !deepComparison(relationMetaHere, getRelationMeta(matches[0], there.field)))
                    if (updateNeeded)
                        await req.payload.update({
                            collection: there.collection,
                            id: docThereId,
                            data: {
                                [there.list]: [
                                    ...entriesThere.filter(entry => getId(entry[there.field]) != docHereId).map(entry => {
                                        entry[there.field] = getId(entry[there.field])
                                        return entry
                                    }),
                                    ...(mode == 'decoupling' ? [] : [newEntryThere])
                                ]
                            },
                            context: {
                                ...context,
                                updateCameFrom: docHereId
                            }
                        })
                } catch (e) {
                    console.log(e)
                } finally {
                    console.log(`${mode} of ${here.collection}.${docHereId} and ${there.collection}.${docThereId}`)
                }
            }
        }
}

export const entriesEqual = (entry1: Record<string, any>, entry2: Record<string, any>, field: string) => {
    const {[field]: relationObject1, id: _, ...relationMeta1} = entry1
    const {[field]: relationObject2, id: __, ...relationMeta2} = entry2

    return getId(relationObject1) == getId(relationObject2) && deepComparison(relationMeta1, relationMeta2)
}

export const deepComparison = (object1: Record<string, any>, object2: Record<string, any>) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length)
        return false

    if (keys1.filter(key => !keys2.includes(key)).length > 0)
        return false

    for (const key of keys1) {
        const val1 = object1[key]
        const val2 = object2[key]
        const deepen = val1 != null && typeof val1 === 'object' && val2 != null && typeof val2 === 'object'
        if (deepen && !deepComparison(val1, val2) || !deepen && val1 !== val2)
            return false
    }

    return true
}