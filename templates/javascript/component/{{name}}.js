import React from 'react'
{{#propTypes}}
import PropTypes from 'prop-types'
{{/propTypes}}
import './style.{{style}}'

const {{name}} = props => {
  return (
    <div>
      {{name}} works!
    </div>
  )
}


{{#propTypes}}
{{name}}.propTypes = {

}
{{/propTypes}}

export default {{name}}
