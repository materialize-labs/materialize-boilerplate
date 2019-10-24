import React, { Component } from 'react';
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
import { DELETE_USER } from '../../graphql/deleteMutations';
import DeleteModal from '../../components/Modals/DeleteModal';
import { GET_ORGANIZATION_USERS } from '../../graphql/queries';
import withSession from '../../hocs/withSession';

const propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  session: PropTypes.shape({
    me: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
};

const defaultProps = {
  users: [],
  session: {},
};

class UsersTable extends Component {
  constructor(props) {
    super(props);
    const { users } = this.props;
    this.state = {
      users,
      allUsers: users,
      filtered: {},
      filters: [],
      selectedRole: null,
    };

    this.getFilterValue = this.getFilterValue.bind(this);
    this.setFilterValue = this.setFilterValue.bind(this);
    this.getFieldFilterValue = this.getFieldFilterValue.bind(this);
    this.filteredFieldValue = this.filteredFieldValue.bind(this);
    this.roleChange = this.roleChange.bind(this);
    this.buildActions = this.buildActions.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ users: nextProps.users });
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
    const users = filterCollection(this.state.allUsers, filters);
    this.setState({
      users,
      filters,
    });
  }

  getFieldFilterValue() {
    const filter = _.find(this.state.filters, { type: 'text' });
    return filter ? filter.value : '';
  }

  filteredFieldValue(props) {
    const { session } = this.props;
    const title = reactStringReplace(
      props.value,
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
        {props.column.id === 'full_name'
          && props.original.id === session.me.id
          && <span className="ml-2"><Badge color="success">Me</Badge></span>
        }
      </div>
    );
  }

  roleChange(props) {
    this.setState({ selectedRole: props });
    const { filtered } = this.state;
    if (props) {
      filtered.roles_string = {
        type: 'text',
        keys: 'roles_string',
        value: props.value,
      };
    } else {
      delete filtered.roles_string;
    }
    this.setState({ filtered });
    this.setTableFilters();
  }

  buildActions(props) {
    const { session } = this.props;
    return (
      <div key={this}>
        {props.original.id !== session.me.id
          && (
            <Mutation mutation={DELETE_USER} refetchQueries={[{ query: GET_ORGANIZATION_USERS }]} errorPolicy="all">
              {deleteUser => (
                <div>
                  <DeleteModal
                    id={props.original.id}
                    mutation={deleteUser}
                  />
                </div>
              )}
            </Mutation>
          )
        }
      </div>
    );
  }

  render() {
    const { users, selectedRole } = this.state;

    const columns = [
      {
        Header: 'NAME',
        accessor: 'full_name',
        Cell: this.filteredFieldValue,
        maxWidth: 300,
      },
      {
        Header: 'TITLE',
        accessor: 'title',
        Cell: this.filteredFieldValue,
        maxWidth: 300,
      },
      {
        Header: 'EMAIL',
        accessor: 'email',
        Cell: this.filteredFieldValue,
        className: 'd-none d-sm-block',
        headerClassName: 'd-none d-sm-block',
      },
      {
        Header: 'ROLES',
        accessor: 'roles_string',
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
      { value: 'owner', label: 'Owner' },
      { value: 'manager', label: 'Manager' },
      { value: 'user', label: 'User' },
    ];

    return (
      <div>

        <Row className="mb-2">
          <Col md="6" lg="4">
            <FormGroup className="mb-0 mr-2 mt-2">
              <Input
                value={this.getFilterValue('search')}
                onChange={e => this.setFilterValue(e, ['full_name', 'title', 'email', 'roles_string'])}
                placeholder="Search"
              />
            </FormGroup>
          </Col>
          <Col md="4" lg="3">
            <FormGroup className="mb-0 mr-2 mt-2">
              <Select
                id="role"
                value={selectedRole}
                onChange={this.roleChange}
                options={options}
                placeholder="Role"
                isClearable
              />
            </FormGroup>
          </Col>
        </Row>

        <ReactTable
          data={users}
          columns={columns}
          className="-highlight"
          getTheadFilterProps={() => ({ style: { display: 'none' } })}
          getTdProps={(state, rowInfo, column) => ({
            onClick: (e, handleOriginal) => {
              if (column.id === 'actions' || rowInfo === undefined) return;

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

UsersTable.propTypes = propTypes;
UsersTable.defaultProps = defaultProps;

export default withSession(UsersTable);
