import { gql } from 'apollo-boost';

export const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id){
      id
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation($id: ID!) {
    deleteUser(id: $id){
      id
    }
  }
`;
