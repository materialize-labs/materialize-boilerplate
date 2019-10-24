import { gql } from 'apollo-boost';

export const GET_ORGANIZATION_CONTACTS = gql`
  query($organization_id: ID!) {
    contacts(organization_id: $organization_id) {
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

export const GET_CONTACT_FORM_FIELDS = gql`
  query($organization_id: ID!) {
    contactFormFields(organization_id: $organization_id) {
      states {
        value
        label
      }
      salutations {
        value
        label
      }
      marital_statuses {
        value
        label
      }
      contact_types {
        emails {
          value
          label
        }
        phone_numbers {
          value
          label
        }
        addresses {
          value
          label
        }
      }
      individual_sub_types {
        value
        label
      }
    }
  }
`;

export const GET_CONTACT = gql`
  query($id: Int!) {
    contact(id: $id) {
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
      fullName
      sub_type
      notes
      createdBy {
        full_name
      }
      primaryContact {
        full_name
      }
      organization {
        id
        name
      }
      addresses {
        id
        organization {name}
        street
        city
        state_abbr
        country_name
        country_id
        type {
          value
          label
        }
        state {
          value
          label
        }
        notes
        is_primary
        post_code
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
