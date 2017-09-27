import React from 'react'
import T from 'prop-types'

const Section = ({ children, storyTitle, description }) => (
  <div>
    <h3>{storyTitle}</h3>
    <p>{description}</p>
    <div className="section-example">
      <span className="section-example--title">Example</span>
      <div className="section-example--inner">
        {children}
      </div>
    </div>
  </div>
)

Section.propTypes = {
  children: T.any.isRequired,
  storyTitle: T.string.isRequired,
  description: T.string,
}

Section.defaultProps = {
  description: '',
}

export default Section
