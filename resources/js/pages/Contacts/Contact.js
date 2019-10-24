import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, Col, Row, Badge, Table,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import withSession from '../../hocs/withSession';
import {
  GET_CONTACT,
  GET_ORGANIZATION_CONTACTS,
} from '../../graphql/Queries/contacts';
import { UPDATE_CONTACT } from '../../graphql/Mutations/contacts';
import EditContactModal from '../../components/Contacts/Modals/EditContactModal';
import NameData from '../../components/Contacts/ContactDetails/NameData';
import InfoData from '../../components/Contacts/ContactDetails/InfoData';
import AffiliateData from '../../components/Contacts/ContactDetails/AffiliateData';
import EmailData from '../../components/Contacts/ContactDetails/EmailData';
import PhoneData from '../../components/Contacts/ContactDetails/PhoneData';
import AddressData from '../../components/Contacts/ContactDetails/AddressData';
// import WebsiteData from '../../components/Contacts/ContactDetails/WebsiteData';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
      organization: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }),
};

const defaultProps = {
  match: {
    params: {
      id: null,
    },
  },
  session: {},
};

class Contact extends Component {
  render() {
    const { match, session } = this.props;

    return (
      <Query
        query={GET_CONTACT}
        variables={{ id: match.params.id }}
      >
        {({
          loading, error, data, refetch,
        }) => {
          if (loading) return 'Loading...';
          if (error || data.contact === undefined) {
            return (<h1>error</h1>);
          }
          const { contact } = data;
          return (
            <div className="">
              <div className="d-flex justify-content-between">
                <div className="ft-26 ft-bold mb-3">
                  {data.contact.type === 'individual'
                    ? (
                      <div>
                        <span>
                          {data.contact.first_name}
                          {' '}
                          {data.contact.last_name}
                        </span>
                        <span className="ml-2" style={{ fontSize: '60%', position: 'relative', bottom: '3px' }}>
                          <Badge color="info">{data.contact.type.toUpperCase()}</Badge>
                        </span>
                      </div>
                    )
                    : (
                      <div>
                        <span>{data.contact.business_name}</span>
                        <span className="ml-2" style={{ fontSize: '60%', position: 'relative', bottom: '3px' }}>
                          <Badge color="warning">{data.contact.type.toUpperCase()}</Badge>
                        </span>
                      </div>
                    )
                  }
                </div>
                <div>
                  <Query
                    query={GET_ORGANIZATION_CONTACTS}
                    variables={{ organization_id: session.me.organization.id }}
                  >
                    {(allContactsQuery) => {
                      if (allContactsQuery.loading) return 'Loading...';
                      if (allContactsQuery.error) return `Error! ${error.message}`;
                      const allContacts = allContactsQuery.data.contacts;
                      return (
                        <div>
                          <Mutation
                            mutation={UPDATE_CONTACT}
                            refetchQueries={[{
                              query: GET_ORGANIZATION_CONTACTS,
                              variables: { organization_id: session.me.organization.id },
                            }]}
                            errorPolicy="all"
                          >
                            {editContact => (
                              <div>
                                <EditContactModal
                                  button="Details"
                                  type="Update"
                                  mutation={editContact}
                                  session={session}
                                  refetch={refetch}
                                  contacts={allContacts}
                                  contact={contact}
                                />
                              </div>
                            )}
                          </Mutation>

                        </div>
                      );
                    }}
                  </Query>
                </div>
              </div>

              <Row>
                <Col md={6}>
                  <Card>
                    <CardHeader>
                      <div className="d-flex justify-content-between">
                        <div className="pt-1">
                          <strong>
                            <i className="fa fa-id-card pr-2" />
                            <span>Meta</span>
                          </strong>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Created By</th>
                            <th>Primary Contact</th>
                            <th>Sub Type</th>
                            <th>Referral Sources</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{data.contact.createdBy.full_name}</td>
                            <td>
                              { data.contact.primaryContact
                                ? data.contact.primaryContact.full_name
                                : <span>&#45;</span>
                              }
                            </td>
                            <td>
                              { data.contact.sub_type
                                ? data.contact.sub_type
                                : <span>&#45;</span>
                              }
                            </td>
                            <td>
                              <span>&#45;</span>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card>
                    <CardHeader>
                      <div className="d-flex justify-content-between">
                        <div className="pt-1">
                          <strong>
                            <i className="fa fa-id-card pr-2" />
                            <span>Notes</span>
                          </strong>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <span dangerouslySetInnerHTML={{ __html: data.contact.notes }} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Card>
                    <CardHeader>
                      <div className="d-flex justify-content-between">
                        <div className="pt-1">
                          <strong>
                            <i className="fa fa-id-card pr-2" />
                            <span>Name</span>
                          </strong>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <NameData contact={data.contact} />
                    </CardBody>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card>
                    <CardHeader>
                      <strong>
                        <i className="fa fa-info-circle pr-2" />
                        <span>Info</span>
                      </strong>
                    </CardHeader>
                    <CardBody>
                      <InfoData contact={data.contact} />
                    </CardBody>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card>
                    <CardHeader>
                      <div className="d-flex justify-content-between">
                        <div className="pt-1">
                          <strong>
                            <i className="fa fa-id-card pr-2" />
                            <span>Affiliations</span>
                          </strong>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <AffiliateData contact={data.contact} />
                    </CardBody>
                  </Card>
                </Col>

              </Row>

              <Row>
                <Col md={6}>
                  <Card>
                    <CardHeader>
                      <strong>
                        <i className="fa fa-info-circle pr-2" />
                        <span>Emails</span>
                      </strong>
                    </CardHeader>
                    <CardBody>
                      <EmailData contact={data.contact} />
                    </CardBody>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card>
                    <CardHeader>
                      <strong>
                        <i className="fa fa-info-circle pr-2" />
                        <span>Phone Numbers</span>
                      </strong>
                    </CardHeader>
                    <CardBody>
                      <PhoneData contact={data.contact} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Card>
                    <CardHeader>
                      <strong>
                        <i className="fa fa-info-circle pr-2" />
                        <span>Addresses</span>
                      </strong>
                    </CardHeader>
                    <CardBody>
                      <AddressData contact={data.contact} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

            </div>
          );
        }}
      </Query>
    );
  }
}

Contact.propTypes = propTypes;
Contact.defaultProps = defaultProps;

export default withSession(Contact);
