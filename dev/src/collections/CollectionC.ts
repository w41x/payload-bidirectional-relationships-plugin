import {CollectionConfig} from 'payload'
import {relationAC} from '@/relationships'

export const CollectionC: CollectionConfig = {
    slug: 'collectionC',
    labels: {
        singular: 'Document of Type C',
        plural: 'Documents of Type C'
    },
    admin: {
        useAsTitle: 'name'
    },
    fields: [
        {
            name: 'name',
            type: 'text'
        },
        relationAC.anchors.collectionC
    ]
}