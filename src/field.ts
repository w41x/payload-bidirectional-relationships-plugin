import {GeneratedTypes} from 'payload'
import {ArrayField} from 'payload/types'
import {RelationConfig, RelationDirection} from './types'
import {extractDirectedRelation} from './helpers'
import {filterFieldOptions} from './filter'
import {validateField} from './validate'
import {afterListChange} from './hooks'

export const relationList = <G extends GeneratedTypes, Config extends RelationConfig<G>>(config: Config, direction: RelationDirection): ArrayField => {
    const {here, there} = extractDirectedRelation<G, Config, typeof direction>(config, direction)
    return {
        ...config[`vertex${direction == 'A->B' ? 'A' : 'B'}`].listOptions,
        name: here.list,
        type: 'array',
        fields: [
            {
                ...config[`vertex${direction == 'A->B' ? 'A' : 'B'}`].fieldOptions,
                name: here.field,
                type: 'relationship',
                relationTo: there.collection,
                filterOptions: filterFieldOptions<G, Config, typeof direction>(config, direction),
                validate: validateField<G, Config, typeof direction>(config, direction)
            },
            ...config.relationMeta
        ],
        hooks: {
            afterChange: [afterListChange<G, Config, typeof direction>(config, direction)],
        }
    }
}