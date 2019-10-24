import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap';
import EditableListItem from './EditableListItem';

const propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  renderItem: PropTypes.func,
  renderForm: PropTypes.func,
  deleteModal: PropTypes.func,
  emptyListMsg: PropTypes.string,
};

const defaultProps = {
  items: [],
  renderItem: () => {},
  renderForm: () => {},
  deleteModal: () => {},
  emptyListMsg: null,
};

const EditableList = (props) => {
  const {
    items,
    renderItem,
    renderForm,
    deleteModal,
    emptyListMsg,
  } = props;
  const [createMode, setCreateMode] = useState(false);
  const setDefaultCreateMode = () => setCreateMode(false);
  return (
    <div>
      {items.length > 0
        ? (
          <ListGroup>
            {items.map(item => (
              <ListGroupItem key={item.id}>
                <EditableListItem
                  item={item}
                  renderForm={renderForm}
                  renderItem={renderItem}
                  deleteModal={deleteModal}
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        )
        : (
          <Alert color="info">
            <i className="fa fa-info-circle mr-1" />
            {emptyListMsg || 'No items available.'}
          </Alert>
        )}
      {createMode && (
        <div className="p-2">
          {renderForm(null, setDefaultCreateMode)}
        </div>
      )}
      <div className="mt-2">
        <Button
          size="sm"
          color="success"
          type="button"
          disabled={createMode}
          onClick={() => setCreateMode(true)}
        >
          <i className="fa fa-plus mr-1" />
          Add Field
        </Button>
      </div>
    </div>
  );
};

EditableList.propTypes = propTypes;
EditableList.defaultProps = defaultProps;

export default EditableList;
