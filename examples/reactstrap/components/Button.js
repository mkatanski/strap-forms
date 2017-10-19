import React from 'react'
import { Button } from 'reactstrap'

import { StrapSubmit, StrapSubmitPropTypes } from '../../../index'

const ButtonPure = ({ disabled, children }) => (
  <Button disabled={disabled} type="submit" >{children}</Button>
)

ButtonPure.propTypes = {
  ...StrapSubmitPropTypes,
}

export default StrapSubmit(ButtonPure)
