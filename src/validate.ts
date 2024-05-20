import {GeneratedTypes} from 'payload'
import {Validate} from 'payload/types'
import {
    DirectedRelation,
    RelatableCollection,
    RelationConfig,
    RelationDirection,
    RelationValue
} from './types.js'
import {extractDirectedRelation, getId, getList} from './helpers.js'
import {I18nServer, NestedKeysStripped} from '@payloadcms/translations'
import {translations} from './translations.js'

export const validateField = <G extends GeneratedTypes, Config extends RelationConfig<G>, Arrow extends RelationDirection>(config: Config, direction: Arrow): Validate<RelationValue<G, DirectedRelation<G, Config, Arrow>['there']['collection']>, RelatableCollection<G>[DirectedRelation<G, Config, Arrow>['here']['collection']]> => (val, {
    data,
    req
}) => ((getList<G, Config, Arrow>(config, direction, data))?.filter(entry => getId(entry[extractDirectedRelation<G, Config, Arrow>(config, direction).here.field]) == getId(val)).length ?? 0) > 1 ? (req.i18n as I18nServer<typeof translations.en, NestedKeysStripped<typeof translations.en>>).t('biDirectionalRelationships:validationError') : true
