'use server'
import {GeneratedTypes} from 'payload'
import {FilterOptions} from 'payload/types'
import {DirectedRelation, RelatableCollection, RelationConfig, RelationDirection} from './types.js'
import {extractDirectedRelation, getId, getList} from './helpers.js'

export const filterFieldOptions = <G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection>(config: Config, direction: Arrow): FilterOptions<RelatableCollection<G>[DirectedRelation<G, Config, Arrow>['here']['collection']]> => async ({data}) => ({
    id: {
        not_in: getList<G, Config, Arrow>(config, direction, data)
            ?.map(entry => getId(entry[extractDirectedRelation<G, Config, Arrow>(config, direction).here.field]))
            .filter(id => id && id.length > 0).join(',') ?? ''
    }
})
