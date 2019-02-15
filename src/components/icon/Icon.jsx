import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { ICONS } from './utils/constants'
import './Icon.scss'

/* eslint-disable */
const Icon = (props) => {
  const {
    icons,
    id,
    className,
    style,
    ariaLabel,
  } = props;

  const iconClass = () => classNames({
    'debut-icon': true,
  }, className);

  const styles = _.isEmpty(style) ? {
    svg: {
      display: 'inline-block',
      verticalAlign: 'middle',
      fill: props.color,
    },
  } : style;

  const viewBox = _.get(icons, 'icon.viewBox', null) || _.get(ICONS, props.icon, {}).viewBox;
  const iconImage = _.get(icons, 'icon.markup', null) || _.get(ICONS, props.icon, {}).markup;

  const onKeyPress = (e) => {
    e.preventDefault();
    if (e.charCode === 13 || e.charCode === 32) {
      props.onTouchTap(e);
    }
  };

  if (_.isEmpty(viewBox) || _.isEmpty(iconImage)) {
    return <p>Icon viewBox or markup does not exist!</p>;
  }

  if (props.onTouchTap && !props.disabled) {
    return (
      <a
        role="button"
        aria-label={ariaLabel}
        onClick={props.onTouchTap}
        tabIndex={0}
        onKeyPress={onKeyPress}
      >
        <svg
          id={id}
          className={iconClass()}
          style={styles.svg}
          width={`${props.size}px`}
          height={`${props.size}px`}
          viewBox={viewBox}
        >
          {iconImage}
        </svg>
      </a>
    );
  }

  return (
    <svg
      id={id}
      className={iconClass()}
      style={styles.svg}
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox={viewBox}
    >
      {iconImage}
    </svg>
  );
};

Icon.propTypes = {
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
  onTouchTap: PropTypes.func,
  icons: PropTypes.object,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

Icon.defaultProps = {
  ariaLabel: null,
  id: '',
  className: '',
  icon: '',
  color: '',
  size: 16,
  onTouchTap: null,
  icons: {},
  style: {},
  disabled: false,
};

export default Icon;
