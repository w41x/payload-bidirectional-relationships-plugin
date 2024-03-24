import {InitOptions} from 'payload/config'

export const payloadInitOptions = async (): Promise<InitOptions> => ({
    secret: 'top-secret'
})