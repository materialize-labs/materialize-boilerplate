import { withFormik } from 'formik';
import _ from 'lodash';
import * as Yup from 'yup';
import moment from 'moment';
import {
  isObjectEmpty,
  partitionRelationData,
  partitionRelationIds,
  replaceNullWithEmptyString,
} from '../ContactsHelpers';
import { parseGraphqlErrors } from '../../../helpers';
import { UPDATE_CONTACT } from '../../../graphql/Mutations/contacts';

const options = [
  { value: 'individual', label: 'Individual' },
  { value: 'company', label: 'Company' },
];

const ContactSchema = Yup.object().shape({
  primary_contact: Yup.object().shape({
    label: Yup.string(),
  }),
  salutation: Yup.object().shape({
    label: Yup.string(),
  }),
  type: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
  first_name: Yup.string().when('type', {
    is: type => type.value === 'individual',
    then: Yup.string()
      .required('First Name is required.')
      .min(2, 'First Name must be longer than 2 characters'),
    otherwise: Yup.string(),
  }),
  middle_name: Yup.string()
    .min(2, 'Middle name must be longer than 2 characters'),
  last_name: Yup.string().when('type', {
    is: type => type.value === 'individual',
    then: Yup.string()
      .required('Last Name is required.')
      .min(2, 'Last Name must be longer than 2 characters'),
    otherwise: Yup.string(),
  }),
  nickname: Yup.string()
    .min(2, 'Nickname must be longer than 2 characters'),
  suffix: Yup.string()
    .min(2, 'Suffix must be longer than 2 characters'),
  title: Yup.string()
    .min(2, 'Title must be longer than 2 characters'),
  professional_title: Yup.string()
    .min(2, 'Professional Title must be longer than 2 characters'),
  ssn: Yup.string()
    .min(2, 'SSN must be longer than 2 characters'),
  sex: Yup.string()
    .min(2, 'Sex must be longer than 2 characters'),
  language: Yup.string()
    .min(2, 'Language must be longer than 2 characters'),
  spouse: Yup.string()
    .min(2, 'Spouse must be longer than 2 characters'),
  marital_status: Yup.object().shape({
    label: Yup.string(),
  })
    .nullable(),
  dob: Yup.date(),
  is_lead: Yup.boolean(),
  business_name: Yup.string().when('type', {
    is: type => type.value === 'company',
    then: Yup.string()
      .required('Business Name is required.')
      .min(2, 'Business Name must be longer than 2 characters'),
    otherwise: Yup.string().min(2, 'Business Name must be longer than 2 characters').nullable(),
  }),
  notes: Yup.string()
    .min(2, 'Notes must be longer than 2 characters'),
  sub_type: Yup.object().shape({
    label: Yup.string(),
  })
    .nullable(),
  emails: Yup.array().of(
    Yup.object().shape({
      email: Yup.string().email('Must be a valid email.'),
      type: Yup.object().shape({
        label: Yup.string(),
      }).nullable(),
    }),
  ),
  phoneNumbers: Yup.array().of(
    Yup.object().shape({
      phone_number: Yup.string().phone(),
    }),
  ),
  websites: Yup.array().of(
    Yup.object().shape({
      website: Yup.string().url('Must be a valid url.'),
    }),
  ),
});

const ContactFormLogic = withFormik({
  mapPropsToValues: (props) => {
    const { contact, formFields, contacts } = props;
    const primaryContacts = contacts.map(person => ({
      value: person.id,
      label: person.fullName,
    }));

    const subTypeObj = contact ? _.find(formFields.individual_sub_types, o => o.label === contact.sub_type) : '';
    const salutationObj = contact ? _.find(formFields.salutations, o => o.label === contact.salutation) : '';
    const maritalObj = contact ? _.find(formFields.marital_statuses, o => o.label === contact.marital_status) : '';
    const primaryContact = contact ? _.find(primaryContacts, o => parseInt(o.value, 10) === contact.primary_contact_id) : '';
    const addresses = (contact && contact.addresses && contact.addresses.length > 0)
      ? contact.addresses.map(replaceNullWithEmptyString) : [{
        street: '',
        city: '',
        state: '',
        post_code: '',
        is_primary: '',
        type: '',
        notes: '',
        country_id: '',
      }];
    const emails = (contact && contact.emails && contact.emails.length > 0)
      ? contact.emails.map(replaceNullWithEmptyString) : [{
        email: '',
        is_primary: '',
        type: '',
        notes: '',
      }];

    const websites = (contact && contact.websites && contact.websites.length > 0)
      ? contact.websites.map(replaceNullWithEmptyString) : [{
        website: '',
        is_primary: '',
        type: '',
        notes: '',
      }];

    const phoneNumbers = (contact && contact.phoneNumbers && contact.phoneNumbers.length > 0)
      ? contact.phoneNumbers.map(replaceNullWithEmptyString) : [{
        phone_number: '',
        is_primary: '',
        type: '',
        notes: '',
      }];

    const referralSources = (contact && contact.referralSources
      && contact.referralSources.length > 0)
      ? contact.referralSources.map(c => ({
        value: c.id,
        label: c.fullName,
      })) : [];

    const type = contact && contact.type ? _.find(options, o => o.value === contact.type) : {
      value: 'individual',
      label: 'Individual',
    };

    return {
      sub_type: subTypeObj,
      salutation: salutationObj,
      first_name: contact.first_name || '',
      last_name: contact.last_name || '',
      middle_name: contact.middle_name || '',
      nickname: contact.nickname || '',
      suffix: contact.suffix || '',

      sex: contact.sex || '',
      ssn: contact.ssn || '',
      dob: contact.dob ? new Date(contact.dob) : '',
      language: contact.language || '',
      marital_status: maritalObj,
      spouse: contact.spouse || '',
      is_lead: contact.is_lead || false,

      type,
      addresses,
      emails,
      websites,
      phoneNumbers,
      business_name: contact.business_name || '',
      title: contact.title || '',
      professional_title: contact.professional_title || '',

      primary_contact: primaryContact || '',
      referralSources,

      notes: contact.notes || '',
    };
  },

  handleSubmit: (values, {
    setSubmitting,
    setFieldError,
    setStatus,
    props: {
      mutation, closeModal, tableRefetch, session, contact, formFieldsRefetch, client,
    },
  }) => {
    setStatus({ errors: null });

    let selfPrimary = false;
    let primaryContactId = _.get(values, 'primary_contact.value', null);

    if (parseInt(primaryContactId, 10) === 0) {
      primaryContactId = null;
      selfPrimary = true;
    }

    const subType = (!values.sub_type)
      ? { disconnect: true }
      : (values.sub_type.__isNew__)
        ? { create: { organization_id: session.me.organization.id, name: values.sub_type.value } }
        : { connect: values.sub_type.value };

    const flatReferralSources = (contact.referralSources && contact.referralSources.length > 0)
      ? contact.referralSources.map(c => c.id) : [];

    const variables = Object.assign({}, values, {
      type: _.get(values, 'type.value', null),
      subType,
      organization_id: parseInt(session.me.organization.id, 10),
      addresses: partitionRelationData(values.addresses
        .filter(address => !isObjectEmpty(address)).map(address => ({
          id: address.id,
          state_id: _.get(address, 'state.value', null),
          organization_id: address.organization_id,
          street: address.street,
          street_extra: address.street_extra,
          city: address.city,
          post_code: address.post_code,
          is_primary: address.is_primary,
          type_id: _.get(address, 'type.value', null),
          notes: address.notes,
          country_id: address.country_id || 840,
        })), contact.addresses),
      dob: values.dob ? moment(values.dob).format('YYYY-MM-DD') : null,
      emails: partitionRelationData(values.emails.map(email => ({
        id: email.id,
        organization_id: email.organization_id,
        email: email.email,
        is_primary: email.is_primary,
        type_id: _.get(email, 'type.value', null),
        notes: email.notes,
      })), contact.emails),
      is_lead: values.is_lead ? 1 : 0,
      marital_status_id: _.get(values, 'marital_status.value', null),
      phoneNumbers: partitionRelationData(values.phoneNumbers.map(phone => ({
        id: phone.id,
        organization_id: phone.organization_id,
        phone_number: phone.phone_number,
        is_primary: phone.is_primary,
        type_id: _.get(phone, 'type.value', null),
        notes: phone.notes,
      })), contact.phoneNumbers),
      primary_contact_id: primaryContactId,
      salutation_id: _.get(values, 'salutation.value', null),
      websites: partitionRelationData(values.websites.map(web => ({
        id: web.id,
        organization_id: web.organization_id,
        website: web.website,
        is_primary: web.is_primary,
        notes: web.notes,
      })), contact.websites),
      referralSources: partitionRelationIds(
        flatReferralSources,
        values.referralSources.map(el => el.value),
      ),
      id: contact.id,
    });

    mutation({ variables }).then(async ({ data }) => {
      setSubmitting(false);
      closeModal();
      if (selfPrimary) {
        const { addContact: contactData } = data;
        contactData.primary_contact_id = contactData.id;
        contactData.organization_id = contactData.organization.id;
        await client.mutate({ mutation: UPDATE_CONTACT, variables: contactData });
      }
      await (tableRefetch());
      await (formFieldsRefetch());
    })
      .catch((error) => {
        if (error.graphQLErrors) {
          const { serverErrors, validationErrors } = parseGraphqlErrors(error, { state_id: 'state' });
          validationErrors.forEach(err => setFieldError(err.field, err.message));
          if (serverErrors.length > 0) {
            setStatus({ errors: serverErrors.map(err => err.message).join('<br>') });
          }
        }

        setSubmitting(false);
      });
  },

  validationSchema: ContactSchema,

  displayName: 'ContactForm',

});

export default ContactFormLogic;
