import { gql } from 'apollo-boost';

export const LOGIN_USER = gql`
    mutation($email: String!, $password: String!){
        login(data: { username: $email, password: $password }){ access_token }
    }
`;

export const REGISTER_USER = gql`
    mutation(
        $first_name: String!,
        $last_name: String!,
        $email: String!,
        $organization: String!,
        $phone: String,
        $password: String!
    ){
        newUser(data: {
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            phone: $phone,
            password: $password,
            organization: {
                create: {
                    name: $organization
                }
            }
        }){
            access_token
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation($email: String!){
        forgotPassword(data: { email: $email }){
            status
            message
        }
    }
`;

export const UPDATE_FORGOTTEN_PASSWORD = gql`
    mutation($email: String!, $token: String!, $password: String!, $passwordConfirmation: String!){
        updateForgottenPassword(data: {
            email: $email,
            token: $token,
            password: $password,
            password_confirmation: $passwordConfirmation
        }) {
            status
            message
        }
    }
`;

export const VERIFY_USER_EMAIL = gql`
  mutation($id: String!, $expires: Int!, $signature: String!) {
      verifyEmail(data: { id: $id, expires: $expires, signature: $signature}) {
        status
        message
      }
  }
`;

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation {
      resendVerificationEmail {
          status
          message
      }
  }
`;

export const INVITE_USER = gql`
    mutation(
        $first_name: String!,
        $last_name: String!,
        $email: String!,
        $title: String!,
        $role: String!,
        $password: String!
        $organization: ID!,
    ){
        inviteUser(data: {
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            title: $title,
            role: $role,
            password: $password,
            organization: {
                connect: $organization
            }
        }){
            status
            message
        }
    }
`;

export const UPDATE_USER = gql`
    mutation(
        $id: ID!,
        $first_name: String,
        $last_name: String,
        $email: String,
        $password: String
        $title: String,
        $phone: String,
    ){
        updateUser(
            id: $id,
            first_name: $first_name,
            last_name: $last_name,
            email: $email,
            password: $password,
            title: $title,
            phone: $phone,
        ){
            id
            first_name
            last_name
            email
            phone
            title
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation(
        $id: ID!,
        $password: String!,
    ){
        changePassword(data: {
            id: $id,
            password: $password,
        }){
            id
        }
    }
`;

export const UPDATE_ORGANIZATION = gql`
    mutation(
        $id: ID!,
        $name: String!,
    ){
        updateOrganization(
            id: $id,
            name: $name,
        ){
            id
            name
        }
    }
`;
