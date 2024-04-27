import {CollectionConfig} from 'payload/types'
import {relationAB, relationAC} from '@/relationships'

export const CollectionA: CollectionConfig = {
    slug: 'collectionA',
    labels: {
        singular: 'Document of Type A',
        plural: 'Documents of Type A'
    },
    admin: {
        useAsTitle: 'name'
    },
    fields: [
        {
            name: 'name',
            type: 'text'
        },
        relationAB.anchors.collectionA,
        relationAC.anchors.collectionA
    ]
}