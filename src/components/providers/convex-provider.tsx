'use client'

import { ReactNode } from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const ConvexClentProvider = ({
  children
}: {
  children: ReactNode
}) => (
  <ClerkProvider publishableKey="pk_test_bmV4dC1jYXR0bGUtODMuY2xlcmsuYWNjb3VudHMuZGV2JA">
    <ConvexProviderWithClerk
      useAuth={useAuth}
      client={convex}
    >
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
)
