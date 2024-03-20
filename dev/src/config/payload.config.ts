import {buildConfig} from 'payload/config'
import path from 'path'
import {fileURLToPath} from 'url'

import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {lexicalEditor} from '@payloadcms/richtext-lexical'

import {collections} from '@/collections'
import {biDirectionalRelationships} from 'payloadcms-bidirectional-relationships-plugin'
import {relationAB, relationAC} from '@/relationships'

const devAccount = {
    email: "plugin@payload.cms",
    password: "password",
}

export default buildConfig({
    serverURL: 'http://localhost',
    secret: 'top-secret',
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
        outputFile: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'payload-types.ts'),
    },
    async onInit(payload) {
        'use server'
        const existingUsers = await payload.find({
            collection: 'users',
            limit: 1,
        });

        if (existingUsers.docs.length === 0) {
            await payload.create({
                collection: 'users',
                data: devAccount,
            });
        }
    },
    plugins: [
        biDirectionalRelationships([relationAB, relationAC])
    ]
})