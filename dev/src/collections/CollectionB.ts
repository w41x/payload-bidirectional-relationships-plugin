import {CollectionConfig} from 'payload'
import {relationAB} from '@/relationships'

export const CollectionB: CollectionConfig = {
    slug: 'collectionB',
    labels: {
        singular: 'Document of Type B',
        plural: 'Documents of Type B'
    },
    admin: {
        useAsTitle: 'name'
    },
    fields: [
        {
            name: 'name',
            type: 'text'
        },
        relationAB.anchors.collectionB
    ]
}