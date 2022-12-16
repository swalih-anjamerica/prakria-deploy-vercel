import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { RiLogoutBoxLine } from 'react-icons/ri';

function LogoutButton() {

  let { logout } = useAuth();
  let { role } = useAuth();

  return (
    <span style={{paddingLeft:"0"}} onClick={logout} className={`cursor-pointer`}>
      {/* <button onClick={logout} className="vertical-navbar-item">Logout</button> */}
      <div className='flex  items-center text-left gap-3'>
        {/* <div><RiLogoutBoxLine className='w-4 h-4'/></div> */}
        <div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 7L8.41 8.41L5.83 11H16V13H5.83L8.41 15.58L7 17L2 12L7 7ZM20 5H12V3H20C21.1 3 22 3.9 22 5V19C22 20.1 21.1 21 20 21H12V19H20V5Z" fill="black" />
          </svg>
        </div>
        <div>Logout</div>
      </div>
    </span>
  )
}

export default LogoutButton