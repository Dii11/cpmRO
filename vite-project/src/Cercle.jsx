import React from 'react'
import './Cercle.css'
const Cercle = ({taches}) => {
  return (
    <div className='cercle'>
      <div className='dateplustot'>{taches.dateDebutPlusTot}</div>
      <div className='dateplustard'>{taches.datePlustard}</div>
    </div>
  )
}

export default Cercle
