import React from 'react';
import {
  Button, Tooltip,
} from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  id: PropTypes.number.isRequired,
  item: PropTypes.shape({
    placement: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
};

class TooltipItem extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false,
    };
  }

  toggle() {
    this.setState(previousState => ({
      tooltipOpen: !previousState.tooltipOpen,
    }));
  }

  render() {
    const { id, item } = this.props;
    const { tooltipOpen } = this.state;
    return (
      <span>
        <Button className="mr-1" color="secondary" id={`Tooltip-${id}`}>
          {item.text}
        </Button>
        <Tooltip
          placement={item.placement}
          isOpen={tooltipOpen}
          target={`Tooltip-${id}`}
          toggle={this.toggle}
        >
          Tooltip Content!
        </Tooltip>
      </span>
    );
  }
}

TooltipItem.propTypes = propTypes;

export default TooltipItem;
