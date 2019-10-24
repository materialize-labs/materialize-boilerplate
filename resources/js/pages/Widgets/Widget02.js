import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter } from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  footer: PropTypes.bool,
  link: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  // eslint-disable-next-line
  cssModule: PropTypes.object,
};

const defaultProps = {
  header: '$1,999.50',
  mainText: 'Income',
  icon: 'fa fa-cogs',
  color: 'primary',
  variant: '0',
  link: '#',
  footer: false,
  children: null,
  className: '',
};

const Widget02 = (props) => {
  const {
    className,
    cssModule,
    header,
    mainText,
    icon,
    color,
    footer,
    link,
    children,
    variant,
    ...attributes
  } = props;

  // demo purposes only
  let padding = {};
  switch (variant) {
  case '0':
    padding = {
      card: 'p-3',
      icon: 'p-3',
      lead: 'mt-2',
    };
    break;
  case '1':
    padding = {
      card: 'p-0',
      icon: 'p-4',
      lead: 'pt-3',
    };
    break;
  default:
    padding = {
      card: 'p-0',
      icon: 'p-4 px-5',
      lead: 'pt-3',
    };
  }

  const card = {
    style: 'clearfix',
    color,
    icon,
    classes: '',
  };
  card.classes = mapToCssModules(classNames(className, card.style, padding.card), cssModule);

  const lead = {
    style: 'h5 mb-0',
    color,
    classes: '',
  };
  lead.classes = classNames(lead.style, `text-${card.color}`, padding.lead);

  const blockIcon = (iconClass) => {
    const classes = classNames(iconClass, `bg-${card.color}`, padding.icon, 'font-2xl mr-3 float-left');
    return (<i className={classes} />);
  };

  const cardFooter = () => {
    if (footer) {
      return (
        <CardFooter className="px-3 py-2">
          <a className="font-weight-bold font-xs btn-block text-muted" href={link}>
            View More
            <i className="fa fa-angle-right float-right font-lg" />
          </a>
        </CardFooter>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardBody className={card.classes} {...attributes}>
        {blockIcon(card.icon)}
        <div className={lead.classes}>{header}</div>
        <div className="text-muted text-uppercase font-weight-bold font-xs">{mainText}</div>
      </CardBody>
      {cardFooter()}
    </Card>
  );
};

Widget02.propTypes = propTypes;
Widget02.defaultProps = defaultProps;

export default Widget02;
