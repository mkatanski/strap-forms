import React from 'react'
import { StrapForm, StrapFormPropTypes } from '../../../index'

const FormPure = ({ children, handleSubmit }) => (
  <form onSubmit={handleSubmit} >{children}</form>
)

FormPure.propTypes = {
  ...StrapFormPropTypes,
}

export default StrapForm(FormPure)
