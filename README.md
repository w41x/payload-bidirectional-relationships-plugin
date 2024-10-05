# payload-bidirectional-relationships-plugin

[![NPM](https://nodei.co/npm/payload-bidirectional-relationships-plugin.png)](https://npmjs.org/package/payload-bidirectional-relationships-plugin)

plugin for [Payload CMS](https://payloadcms.com), which enables bidirectional relationships

:boom: :boom: :boom: &nbsp; works :100: with PayloadCMS version :two: and :three: &nbsp; :boom: :boom: :boom:

:bangbang: currently only works with MongoDB :bangbang:

> [!NOTE]
>
> You are currently in the v3 branch!

[Go to main branch](https://github.com/w41x/payload-bidirectional-relationships-plugin)

[Go to v2 branch](https://github.com/w41x/payload-bidirectional-relationships-plugin/tree/v2)

## What this is for

- You have collections that are referencing each other in a bidirectional MxN way.
- Those relationships have properties on their own, but you don't want them to have their own collection -
  instead you would like those properties to be embedded within the relationship field and synchronized between both
  related collections.

## Example use case

- Collection A: Projects (e.g. Open Source Projects)
- Collection B: Persons (e.g. Developers)
- Relation between A and B: Participation (i.e.: persons could participate in some way in a project - projects have
  participants)
- Each relation (participation) has meta data (e.g. type of participation: contributor, moderator, core, owner, guest,
  etc.)
- you want those information to be embedded in both collections and automatically synced (no third collection for the
  relation)

## How the plugin works

- you define the relationships
- this gives you the two *anchors*
- you place those *anchors* at the desired place in the collections
- you add the plugin to your payload config with those relationships as parameters
- the plugin handles automatically all synchronization hooks

## Install

```shell
pnpm add payload-bidirectional-relationships-plugin@0.4.29-v3
```

> [!WARNING]
>
> Be aware to install only that version of this plugin which is compatible
> with the PayloadCMS version you are using! So if you are using PayloadCMS v2, there should be a '-v2' at the end
> instead
> of a '-v3' and vice versa.
> In the future, when this plugin becomes stable, there will be 2.x.x and 3.x.x versions.

## Usage

### define relationships

```ts
import {biDirectionalRelationship} from 'payload-bidirectional-relationships-plugin'

export const relationAB = biDirectionalRelationship({
    vertexA: {
        anchor: 'collectionA.listA.fieldA',
        // Options for the ArrayField 'listA'
        listOptions: {
            label: 'Relations to a document of Type B',
            labels: {
                singular: 'Relation to a document of Type B',
                plural: 'Relations to a document of Type B'
            }
        },
        // Options for the RelationshipField 'fieldA'
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
    /*
        array of fields that will be display beneath each relation field;
        each field is "part" of the relationship and describes it
    */
    relationMeta: [
        {
            name: 'relationMeta',
            type: 'text'
        }
    ]
})
```

### add anchors to the collection configs at the desired place:

```ts
import {CollectionConfig} from 'payload/types'
import {relationAB} from './relationships'

export const CollectionA: CollectionConfig = {
    slug: 'collectionA',
    labels: {
        singular: 'Document of Type A',
        plural: 'Documents of Type A',
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text'
        },
        relationAB.anchors.collectionA
    ],
}

export const CollectionB: CollectionConfig = {
    slug: 'collectionB',
    labels: {
        singular: 'Document of Type B',
        plural: 'Documents of Type B',
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text'
        },
        relationAB.anchors.collectionB
    ],
}
```

### add hooks by using the plugin and referencing all relationships:

```ts
import {buildConfig} from 'payload/config'
import {relationAB, /*...*/} from './relationships'

export default buildConfig({
    //...,
    plugins: [
        //...,
        biDirectionalRelationships([relationAB /*, ...*/])
    ]
})
```

## Possible future features

- possibilty to define sync and deletion rules
- allow for 1x1 relationships (without ArrayField)
- allow for polydirectional relationships (more than two anchors)

## What is planned in the near future

- when Payload v3 becomes stable: release of 2.0.0 (stable) and 3.0.0 (stable)
- maybe a PR for the payload monorepo?