import {biDirectionalRelationship} from 'payloadcms-bidirectional-relationships-plugin'

export const relationAC = biDirectionalRelationship({
    vertexA: {
        anchor: 'collectionA.listA2.fieldA',
        listOptions: {
            label: 'Relations to a document of Type C',
            labels: {
                singular: 'Relation to a document of Type C',
                plural: 'Relations to a document of Type C'
            }
        },
        fieldOptions: {
            label: 'Reference to a document of Type C'
        }
    },
    vertexB: {
        anchor: 'collectionC.listC.fieldC',
        listOptions: {
            label: 'Relations to a document of Type A',
            labels: {
                singular: 'Relation to a document of Type A',
                plural: 'Relations to a document of Type A'
            }
        },
        fieldOptions: {
            label: 'Reference to a document of Type A'
        }
    },
    relationMeta: [
        {
            name: 'relationMeta',
            type: 'text'
        }
    ]
})