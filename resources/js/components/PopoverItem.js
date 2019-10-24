import React, { Component } from 'react';
import {
  Button,
  Popover,
  PopoverBody,
  PopoverHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.shape({
    placement: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
};

class PopoverItem extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
    };
  }

  toggle() {
    this.setState(previousState => ({
      popoverOpen: !previousState.popoverOpen,
    }));
  }

  render() {
    const { item, id } = this.props;
    const { popoverOpen } = this.state;
    return (
      <span>
        <Button
          className="mr-1"
          color="secondary"
          id={`Popover-${id}`}
          onClick={this.toggle}
        >
          {item.text}
        </Button>
        <Popover
          placement={item.placement}
          isOpen={popoverOpen}
          target={`Popover-${id}`}
          toggle={this.toggle}
        >
          <PopoverHeader>Popover Title</PopoverHeader>
          <PopoverBody>
            Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque
            ornare sem lacinia quam venenatis vestibulum.
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}

PopoverItem.propTypes = propTypes;

export default PopoverItem;
