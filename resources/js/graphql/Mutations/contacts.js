import { gql } from 'apollo-boost';

export const ADD_CONTACT = gql`
    mutation(
    $organization_id: Int!
    $type: String!
    $salutation_id: Int
    $first_name: String
    $last_name: String
    $middle_name: String
    $nickname: String
    $suffix: String

    $sex: String,
    $ssn: String,
    $dob: String,
    $language: String,
    $marital_status_id: Int,
    $spouse: String,
    $is_lead: Int,

    $addresses: CreateAddressRelation
    $phoneNumbers: CreatePhoneNumberRelation
    $emails: CreateEmailRelation
    $websites: CreateWebsiteRelation
    $subType: CreateIndividualSubTypeRelation

    $business_name: String,
    $title: String,
    $professional_title: String,

    $primary_contact_id: Int,
    $referralSources: CreateReferralSourceRelation,
    $notes: String
    ){
        addContact(data: {
            organization_id: $organization_id
            type: $type
            salutation_id: $salutation_id
            first_name: $first_name
            last_name: $last_name
            middle_name: $middle_name
            nickname: $nickname
            suffix: $suffix

            sex: $sex,
            ssn: $ssn,
            dob: $dob,
            language: $language,
            marital_status_id: $marital_status_id,
            spouse: $spouse,
            is_lead: $is_lead,

            addresses: $addresses
            phoneNumbers: $phoneNumbers
            emails: $emails
            websites: $websites
            subType: $subType

            business_name: $business_name,
            title: $title,
            professional_title: $professional_title,

            primary_contact_id: $primary_contact_id,
            referralSources: $referralSources,
            notes: $notes
        }
        ){
            id
            type
            first_name
            middle_name
            last_name
            nickname
            salutation
            suffix
            business_name
            title
            professional_title
            ssn
            dob
            sex
            language
            marital_status
            spouse
            alternative_contact
            mailing_list
            primaryEmailAddress
            primaryPhoneNumber
            primary_contact_id
            fullName
            is_lead
            notes
            sub_type
            organization {
                id
                name
            }
            addresses {
                id
                organization_id
                street
                city
                country_id
                country_name
                state {
                    value
                    label
                }
                post_code
                type {
                    value
                    label
                }
                notes
            }
            emails {
                id
                email
                is_primary
                type {
                    value
                    label
                }
                notes
            }
            websites {
                id
                website
                is_primary
                notes
            }
            phoneNumbers {
                id
                phone_number
                is_primary
                type {
                    value
                    label
                }
                notes
            }
            referralSources {
                id
                fullName
            }
        }
    }
`;

export const UPDATE_CONTACT = gql`
    mutation(
    $organization_id: Int!
    $type: String!
    $salutation_id: Int
    $first_name: String
    $last_name: String
    $middle_name: String
    $nickname: String
    $suffix: String

    $sex: String,
    $ssn: String,
    $dob: String,
    $language: String,
    $marital_status_id: Int,
    $spouse: String,
    $is_lead: Int,

    $addresses: CreateAddressRelation
    $phoneNumbers: CreatePhoneNumberRelation
    $emails: CreateEmailRelation
    $websites: CreateWebsiteRelation
    $subType: CreateIndividualSubTypeRelation

    $business_name: String,
    $title: String,
    $professional_title: String,

    $primary_contact_id: Int,
    $referralSources: CreateReferralSourceRelation,
    $notes: String
    $id: ID!
    ){
        updateContact( id: $id, data: {
            organization_id: $organization_id
            type: $type
            salutation_id: $salutation_id
            first_name: $first_name
            last_name: $last_name
            middle_name: $middle_name
            nickname: $nickname
            suffix: $suffix

            sex: $sex,
            ssn: $ssn,
            dob: $dob,
            language: $language,
            marital_status_id: $marital_status_id,
            spouse: $spouse,
            is_lead: $is_lead,

            addresses: $addresses
            phoneNumbers: $phoneNumbers
            emails: $emails
            websites: $websites
            subType: $subType

            business_name: $business_name,
            title: $title,
            professional_title: $professional_title,

            primary_contact_id: $primary_contact_id,
            referralSources: $referralSources,
            notes: $notes
        }
        ){
            id
            type
            first_name
            middle_name
            last_name
            nickname
            salutation
            suffix
            business_name
            title
            professional_title
            ssn
            dob
            sex
            language
            marital_status
            spouse
            alternative_contact
            mailing_list
            primaryEmailAddress
            primaryPhoneNumber
            primary_contact_id
            fullName
            is_lead
            notes
            sub_type
            organization {
                id
                name
            }
            addresses {
                id
                organization_id
                street
                city
                country_name
                country_id
                state {
                    value
                    label
                }
                post_code
                type {
                    value
                    label
                }
                notes
            }
            emails {
                id
                email
                is_primary
                type {
                    value
                    label
                }
                notes
            }
            websites {
                id
                website
                is_primary
                notes
            }
            phoneNumbers {
                id
                phone_number
                is_primary
                type {
                    value
                    label
                }
                notes
            }
            referralSources {
                id
                fullName
            }
        }
    }
`;

export const DELETE_CONTACT = gql`
    mutation($id: ID!) {
        deleteContact(id: $id){
            id
        }
    }
`;
