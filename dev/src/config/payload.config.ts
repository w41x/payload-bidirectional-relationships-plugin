import {buildConfig} from 'payload/config'
import path from 'path'
import {fileURLToPath} from 'url'

import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {lexicalEditor} from '@payloadcms/richtext-lexical'

import {collections} from '@/collections'
import {biDirectionalRelationships} from 'payload-bidirectional-relationships-plugin'
import {relationAB, relationAC} from '@/relationships'

import {de} from '@payloadcms/translations/languages/de'
import {en} from '@payloadcms/translations/languages/en'

const devAccount = {
    email: 'plugin@payload.cms',
    password: 'password'
}

export default buildConfig({
    admin: {
        autoLogin: {
            ...devAccount,
            prefillOnly: true
        }
    },
    collections,
    db: mongooseAdapter({url: 'mongodb://root:secret@db:27017'}),
    editor: lexicalEditor(),
    i18n: {
        supportedLanguages: {de, en}
    },
    async onInit(payload) {
        const existingUsers = await payload.find({
            collection: 'users',
            limit: 1
        })

        if (existingUsers.docs.length === 0) {
            await payload.create({
                collection: 'users',
                data: devAccount
            })
        }
    },
    plugins: [
        biDirectionalRelationships([relationAB, relationAC])
    ],
    secret: 'top-secret',
    telemetry: false,
    typescript: {
        outputFile: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'payload-types.ts')
    }
})