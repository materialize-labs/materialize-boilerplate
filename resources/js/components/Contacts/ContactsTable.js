import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Select from 'react-select';
import { Mutation } from 'react-apollo';
import {
  Row,
  Col,
  FormGroup,
  Input,
  Badge,
} from 'reactstrap';
import _ from 'lodash';
import 'react-table/react-table.css';
import reactStringReplace from 'react-string-replace';
import { filterCollection } from '../../helpers/Filters';
import { UPDATE_CONTACT, DELETE_CONTACT } from '../../graphql/Mutations/contacts';
import { GET_ORGANIZATION_CONTACTS } from '../../graphql/Queries/contacts';
import DeleteModal from '../Modals/DeleteModal';
import EditContactModal from './Modals/EditContactModal';
import withSession from '../../hocs/withSession';

const propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object),
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
      organization: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  refetch: PropTypes.func,
};

const defaultProps = {
  contacts: [],
  session: {},
  refetch: () => { },
};

class ContactsTable extends Component {
  constructor(props) {
    super(props);
    const { contacts } = this.props;
    this.state = {
      contacts,
      allContacts: contacts,
      filtered: {},
      filters: [],
      selectedType: null,
    };

    this.getFilterValue = this.getFilterValue.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);
    this.getFieldFilterValue = this.getFieldFilterValue.bind(this);
    this.filteredFieldValue = this.filteredFieldValue.bind(this);
    this.typeChange = this.typeChange.bind(this);
    this.buildActions = this.buildActions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ contacts: nextProps.contacts });
  }

  getFilterValue(id) {
    return _.get(this.state, `filtered.${id}.value`, '');
  }

  setFilterValue(element, id) {
    const { filtered } = this.state;

    filtered.search = {
      type: 'text',
      keys: id,
      value: element.target.value,
    };

    this.setState({ ...this.state, filtered });
    this.setTableFilters();
  }

  setTableFilters() {
    const filters = Object.keys(this.state.filtered).map(filter => this.state.filtered[filter]);
    const contacts = filterCollection(this.state.allContacts, filters);
    this.setState({
      contacts,
      filters,
    });
  }

  getFieldFilterValue() {
    const filter = _.find(this.state.filters, { type: 'text' });
    return filter ? filter.value : '';
  }

  getTypeValue(props) {
    return (
      <div key={this}>
        { props.value === 'individual'
          ? <Badge color="info">{props.value.toUpperCase()}</Badge>
          : <Badge color="warning">{props.value.toUpperCase()}</Badge>
        }
      </div>
    );
  }

  filteredFieldValue(props) {
    const val = props.column.id === 'type'
      ? props.value.charAt(0).toUpperCase() + props.value.slice(1) : props.value;
    const title = reactStringReplace(
      val,
      this.getFieldFilterValue(props.column.id),
      (match, i) => (
        <span
          key={i}
          className="search-highlight"
        >
          {match}
        </span>
      ),
    );
    return (
      <div className="h-100 align-items-center d-flex">
        <span className="truncate">{title}</span>
      </div>
    );
  }

  typeChange(props) {
    this.setState({ selectedType: props });
    const { filtered } = this.state;
    if (props) {
      filtered.type = {
        type: 'text',
        keys: 'type',
        value: props.value,
      };
    } else {
      delete filtered.type;
    }
    this.setState({ filtered });
    this.setTableFilters();
  }

  buildActions(props) {
    const { session, contacts, refetch } = this.props;

    // const contactObject = _.find(contacts, value => value.id === props.original.id);

    return (
      <div key={this} className="d-flex justify-content-around">
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
                type="Update"
                mutation={editContact}
                session={session}
                refetch={refetch}
                contacts={contacts}
                contact={props.original}
              />
            </div>
          )}
        </Mutation>
        <Mutation
          mutation={DELETE_CONTACT}
          refetchQueries={[{
            query: GET_ORGANIZATION_CONTACTS,
            variables: { organization_id: session.me.organization.id },
          }]}
          errorPolicy="all"
        >
          {deleteContact => (
            <div>
              <DeleteModal
                id={props.original.id}
                mutation={deleteContact}
              />
            </div>
          )}
        </Mutation>
      </div>
    );
  }

  render() {
    const { contacts, selectedType } = this.state;

    const columns = [
      {
        Header: 'TYPE',
        accessor: 'type',
        Cell: this.getTypeValue,
        maxWidth: 130,
      },
      {
        Header: 'NAME',
        accessor: 'fullName',
        Cell: this.filteredFieldValue,
        maxWidth: 300,
      },
      {
        Header: 'PRIMARY EMAIL',
        accessor: 'primaryEmailAddress',
        Cell: this.filteredFieldValue,
        className: 'd-none d-sm-block',
        headerClassName: 'd-none d-sm-block',
      },
      {
        Header: 'PRIMARY PHONE',
        accessor: 'primaryPhoneNumber',
        Cell: this.filteredFieldValue,
        className: 'd-none d-sm-block',
        headerClassName: 'd-none d-sm-block',
      },
      {
        Header: '',
        accessor: 'actions',
        Cell: props => this.buildActions(props),
        filterable: false,
        maxWidth: 120,
        sortable: false,
      },
    ];

    const options = [
      { value: 'individual', label: 'Individual' },
      { value: 'company', label: 'Company' },
    ];

    return (
      <div>

        <Row className="mb-2">
          <Col md="6" lg="4">
            <FormGroup className="mb-0 mr-2 mt-2">
              <Input
                value={this.getFilterValue('search')}
                onChange={e => this.setFilterValue(e, ['type', 'fullName', 'primaryEmailAddress'])}
                placeholder="Search"
              />
            </FormGroup>
          </Col>
          <Col md="4" lg="3">
            <FormGroup className="mb-0 mr-2 mt-2">
              <Select
                id="type"
                value={selectedType}
                onChange={this.typeChange}
                options={options}
                placeholder="Type"
                isClearable
              />
            </FormGroup>
          </Col>
        </Row>

        <ReactTable
          data={contacts}
          columns={columns}
          className="-highlight"
          getTheadFilterProps={() => ({ style: { display: 'none' } })}
          getTdProps={(state, rowInfo, column) => ({
            onClick: (e, handleOriginal) => {
              if (column.id === 'actions' || rowInfo === undefined) return;

              const route = `/contacts/${rowInfo.original.id}`;
              this.props.history.push(route);

              if (handleOriginal) {
                handleOriginal();
              }
            },
          })}
        />
      </div>
    );
  }
}

ContactsTable.propTypes = propTypes;
ContactsTable.defaultProps = defaultProps;

export default withRouter(withSession(ContactsTable));
