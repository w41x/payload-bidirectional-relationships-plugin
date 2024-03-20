import {GeneratedTypes} from 'payload'
import {BiDirectionalRelationship, RelationConfig} from './types.js'
import {relationList} from './field.js'
import {extractDirectedRelation} from './helpers.js'
import {afterDocumentDelete} from './hooks.js'
import {CollectionAfterDeleteHook} from 'payload/types.js'
import {Config} from 'payload/config.js'

export const biDirectionalRelationship = <G extends GeneratedTypes, Config extends RelationConfig<G>>(config: Config): BiDirectionalRelationship<G, Config> => {
    const {here, there} = extractDirectedRelation(config, 'A->B')
    return {
        config,
        anchors: {
            [here.collection]: relationList<G, Config>(config, 'A->B'),
            [there.collection]: relationList<G, Config>(config, 'B->A'),
        } as BiDirectionalRelationship<G, Config>['anchors'],
        hooks: {
            [here.collection]: afterDocumentDelete<G, Config>(config, 'A->B'),
            [there.collection]: afterDocumentDelete<G, Config>(config, 'B->A'),
        } as BiDirectionalRelationship<G, Config>['hooks']
    }
}

export const biDirectionalRelationships = <G extends GeneratedTypes>(relationships: BiDirectionalRelationship<G, any>[]) =>
    (incomingConfig: Config): Config => ({
        ...incomingConfig,
        collections: (incomingConfig.collections || []).map((collection) => ({
            ...collection,
            hooks: {
                ...collection.hooks,
                afterDelete: [...collection.hooks?.afterDelete ?? [], ...relationships
                    .filter(relationship => Object.keys(relationship.hooks).includes(collection.slug))
                    .map(relationship => relationship.hooks[collection.slug as keyof BiDirectionalRelationship<G, typeof relationship.config>['hooks']] as CollectionAfterDeleteHook)]
            }
        })),
        i18n: {
            resources: {
                de: {
                    ...incomingConfig.i18n?.resources?.de ?? {},
                    biDirectionalRelationships: {
                        validationError: 'Es gibt bereits eine Beziehung zu diesem Element. Duplikate sind nicht erlaubt.'
                    }
                },
                en: {
                    ...incomingConfig.i18n?.resources?.en ?? {},
                    biDirectionalRelationships: {
                        validationError: 'There is already a relation to this element. Duplicates are not allowed.'
                    }
                }
            }
        }
    })