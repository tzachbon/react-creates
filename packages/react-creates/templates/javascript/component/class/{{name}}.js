import React from 'react'
{{#propTypes}}
import PropTypes from 'prop-types'
{{/propTypes}}
import './style.{{style}}'

export default class {{name}} extends React.Component {

  render() {
    return (
      <div>
        {{name}} works!
      </div>
    )
  }
}


{{#propTypes}}
{{name}}.propTypes = {

}
{{/propTypes}}

