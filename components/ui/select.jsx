import React from 'react'

const Select =  ({title,checked,onChange,onBlur,ref}) => {
  return (
  <div>
<label for="current-job-role">Multi Select</label>
    <select multiple id="current-job-role" className="sd-CustomSelect">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
      <option value="4">Option 4</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
      <option value="4">Option 4</option>
    </select>

  </div>
  )
}

export default Select;