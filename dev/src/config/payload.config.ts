import {buildConfig} from 'payload/config'
import path from 'path'

import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {lexicalEditor} from '@payloadcms/richtext-lexical'

import {collections} from '../collections'
import {biDirectionalRelationships} from 'payload-bidirectional-relationships-plugin'
import {relationAB, relationAC} from '../relationships'

const devAccount = {
    email: "plugin@payload.cms",
    password: "password",
}

export default buildConfig({
    serverURL: 'http://localhost',
    admin: {
        user: 'users',
        autoLogin: {
            ...devAccount,
            prefillOnly: true,
        }
    },
    db: mongooseAdapter({url: 'mongodb://root:secret@db:27017'}),
    editor: lexicalEditor({}),
    collections,
    telemetry: false,
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    plugins: [
        biDirectionalRelationships([relationAB, relationAC])
    ]
})