import React from 'react'
const processString = require('react-process-string')

/* eslint-disable */
let config = [{
    regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => <span key={key}>
                             <a target="_blank" rel="noopener noreferrer" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{result[2]}.{result[3]}{result[4]}</a>{result[5]}
                         </span>
}, {
    regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => <span key={key}>
                             <a target="_blank" rel="noopener noreferrer" href={`http://${result[1]}.${result[2]}${result[3]}`}>{result[1]}.{result[2]}{result[3]}</a>{result[4]}
                         </span>
}];

const linkifyText = (text) => {
  return processString(config)(text)
}

export default linkifyText
