import {biDirectionalRelationship} from 'payloadcms-bidirectional-relationships-plugin'

export const relationAB = biDirectionalRelationship({
    vertexA: {
        anchor: 'collectionA.listA1.fieldA',
        listOptions: {
            label: 'Relations to a document of Type B',
            labels: {
                singular: 'Relation to a document of Type B',
                plural: 'Relations to a document of Type B'
            }
        },
        fieldOptions: {
            label: 'Reference to a document of Type B'
        }
    },
    vertexB: {
        anchor: 'collectionB.listB.fieldB',
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