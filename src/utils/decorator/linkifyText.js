import React from 'react'
import { Link } from 'react-router-dom'
const processString = require('react-process-string')

const isValid = function(str) {
   return !str.match(/\.\./);
}

/* eslint-disable */
let config = [
  {
    regex: /@[a-z0-9]+\.+[a-z]+\.?[a-z]+/gim,
    fn: (key, result) => {
      const user = result[0].substring(1).trim()
      return (
        <span key={key}>
          <Link to={`/${user}`} onClick={(e) => e.stopPropagation()}>{result[0]}</Link>
        </span>
      )
    }
  },
  {
    regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => {
      return (
        <span key={key}>
          <a target="_blank" rel="noopener noreferrer" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{result[2]}.{result[3]}{result[4]}</a>{result[5]}
        </span>
      )
    }
  },
  {
    regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => {
      if (result[0][0] === '#') {
        return (
          <span key={key}>
            {result[0]}
          </span>
        )
      }

      if (isValid(result[0])) {
        return (
          <span key={key}>
            <a target="_blank" rel="noopener noreferrer" href={`http://${result[1]}.${result[2]}${result[3]}`}>{result[1]}.{result[2]}{result[3]}</a>{result[4]}
            </span>
          )
      } else {
        return (
          <span key={key}>
            {result[0]}
          </span>
        )
      }
    }
  }];

const linkifyText = (text) => {
  const result = processString(config)(text)
  return result
}

export default linkifyText
