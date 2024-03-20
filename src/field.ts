import {GeneratedTypes} from 'payload'
import {ArrayField} from 'payload/types.js'
import {RelationConfig, RelationDirection} from './types.js'
import {extractDirectedRelation} from './helpers.js'
import {filterFieldOptions} from './filter.js'
import {validateField} from './validate.js'
import {afterListChange} from './hooks.js'

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