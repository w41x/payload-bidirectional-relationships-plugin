import type {Metadata} from 'next'
import React, {PropsWithChildren} from 'react'

export const metadata: Metadata = {
    title: 'Plugin Test',
    description: 'Bidirectional Relationships',
}

export default function RootLayout({children}: PropsWithChildren) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}
