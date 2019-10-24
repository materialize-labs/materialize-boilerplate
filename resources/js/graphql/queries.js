import { gql } from 'apollo-boost';

export const GET_CURRENT_USER = gql`
    query {
        me {
            first_name
            last_name
            email
            id
            phone
            title
            avatar
        }
    }
`;

export const ORGANIZATIONS = gql`
    query {
        organizations {
            id
            name
        }
    }
`;

export const GET_ORGANIZATION_USERS = gql`
    query {
        orgUsers {
            id
            first_name
            last_name
            title
            email
            phone
            roles_string
            full_name
        }
    }
`;
