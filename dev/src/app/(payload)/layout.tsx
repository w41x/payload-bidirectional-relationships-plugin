/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

import React, {PropsWithChildren} from 'react'
import configPromise from '@payload-config'
import {RootLayout} from '@payloadcms/next/layouts'
import {importMap} from './admin/importMap'

import '@payloadcms/next/css'

const Layout = ({children}: PropsWithChildren) =>
    <RootLayout config={configPromise} importMap={importMap}>{children}</RootLayout>

export default Layout