import React, { useState } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  item: PropTypes.shape(),
  renderForm: PropTypes.func,
  renderItem: PropTypes.func,
  deleteModal: PropTypes.func,
};

const defaultProps = {
  item: null,
  renderForm: () => {},
  renderItem: () => {},
  deleteModal: () => {},
};

const EditableListItem = (props) => {
  const {
    item,
    renderForm,
    renderItem,
    deleteModal,
  } = props;
  const [editMode, setEditMode] = useState(false);

  const closeEditMode = () => setEditMode(false);

  return (
    <div>
      {editMode
        ? (
          renderForm(item, closeEditMode)
        )
        : (
          <div className="w-100 d-flex justify-content-between">
            {renderItem(item)}
            <div
              role="button"
              onClick={() => setEditMode(true)}
              tabIndex={0}
              onKeyUp={() => {}}
              className="mr-2 h-100 d-flex align-items-center"
            >
              <i className="fa fa-edit" />
            </div>
            {deleteModal(item)}
          </div>
        )
      }
    </div>
  );
};

EditableListItem.propTypes = propTypes;
EditableListItem.defaultProps = defaultProps;

export default EditableListItem;
