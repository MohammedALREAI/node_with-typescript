import { ApolloClientCache } from './src/utils/apollooclient';
import { ApolloClient } from '@apollo/client';
import { NextPageContext } from 'next';
declare module 'next'{

     export interface NextPageContext{
          apolloClient?:ApolloClient<ApolloClientCache>
     }
}
