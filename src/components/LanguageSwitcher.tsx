import React from 'react'

function LanguageSwitcher() {
  return (
    <label className="swap swap-rotate w-fit text-lg font-bold hover:text-blue-600 dark:hover:text-sky-300">
      <input type="checkbox" />
      <h1 className="swap-off " >pt</h1>
      <h1 className="swap-on" >en</h1>
    </label>
  )
}

export default LanguageSwitcher
