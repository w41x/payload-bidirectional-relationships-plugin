import {FilterOptions, GeneratedTypes} from 'payload'
import {DirectedRelation, RelatableCollection, RelationConfig, RelationDirection} from './types.js'
import {extractDirectedRelation, getId, getList} from './helpers.js'

export const filterFieldOptions = <G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection>(config: Config, direction: Arrow): FilterOptions<RelatableCollection<G>[DirectedRelation<G, Config, Arrow>['here']['collection']]> => async ({data}) => {
    const excludedIds = getList<G, Config, Arrow>(config, direction, data)
        ?.map(entry => getId(entry[extractDirectedRelation<G, Config, Arrow>(config, direction).here.field]))
        .filter(id => id).join(',')
    return excludedIds ? {
        id: {
            not_in: excludedIds
        }
    } : true
}
