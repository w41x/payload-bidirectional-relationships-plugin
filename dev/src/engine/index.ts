import express from 'express'
import payload from 'payload'
import {payloadInitOptions} from '../config'

export default {
    run: async () => {
        const app = express()
        app.get('/', (_, res) => {
            res.redirect('/admin')
        })
        await payload.init({
            ...await payloadInitOptions(),
            express: app
        })
        app.listen(3000)
    }
}