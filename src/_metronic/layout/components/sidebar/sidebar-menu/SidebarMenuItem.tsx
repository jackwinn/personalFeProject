import { FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { checkIsActive, KTIcon, WithChildren } from '../../../../helpers'
import { useLayout } from '../../../core'
import { toAbsoluteUrl } from '../../../../helpers'
import { RootState } from '../../../../../app/redux/store'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  path?: string

}

const SidebarMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
  path,
}) => {
  const { pathname } = useLocation()
  const isActive = checkIsActive(pathname, to)
  const { config } = useLayout()
  const [page, setPage] = useState(pathname)
  const { app } = config
  const agentSlice = useSelector((state: RootState) => state.user)

  return (
    <div className={clsx('menu-item',

    )}>
      <Link className={clsx('menu-link without-sub', { active: isActive })} to={to}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
          <span className='menu-icon'>
            {' '}
            <KTIcon iconName={icon} className='fs-2' />
          </span>
        )}
        <div className='menu-select'>
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="5" height="36" viewBox="0 0 5 36">
            <path id="Rectangle_935" data-name="Rectangle 935" d="M0,0H0A5,5,0,0,1,5,5V31a5,5,0,0,1-5,5H0a0,0,0,0,1,0,0V0A0,0,0,0,1,0,0Z" fill="#f09108" />
          </svg> */}
        </div>
        {path && (
          <span className='menu-icon'>
            {' '}
            {path === 'dashboard' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M13.8724 3.74951H5.24219V9.2689H13.8724V3.74951ZM3.24219 1.74951V11.2689H15.8724V1.74951H3.24219Z" fill="#A7A9AC" />
                <path fillRule="evenodd" clipRule="evenodd" d="M27.7591 24.1802H19.1289V29.6996H27.7591V24.1802ZM17.1289 22.1802V31.6996H29.7591V22.1802H17.1289Z" fill="#A7A9AC" />
                <path fillRule="evenodd" clipRule="evenodd" d="M27.7591 3.74951H19.1289V18.8886H27.7591V3.74951ZM17.1289 1.74951V20.8886H29.7591V1.74951H17.1289Z" fill="#E7E7E7" />
                <path fillRule="evenodd" clipRule="evenodd" d="M13.8724 14.6104H5.24219V29.7494H13.8724V14.6104ZM3.24219 12.6104V31.7494H15.8724V12.6104H3.24219Z" fill="#E7E7E7" />
              </svg>
            )}       
            {path === 'etenancy' && (
              <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.42969" y="3.74512" width="9.54998" height="7.6984" fill="#E7E7E7" />
                <path fillRule="evenodd" clipRule="evenodd" d="M3.8 2.36836V3.74336V11.4434H10.4V3.74336V2.36836C10.4 1.30617 9.53719 0.443359 8.475 0.443359H5.725C4.66281 0.443359 3.8 1.30617 3.8 2.36836ZM11.5 3.74336V11.4434H12.05C12.9609 11.4434 13.7 10.7043 13.7 9.79336V5.39336C13.7 4.48242 12.9609 3.74336 12.05 3.74336H11.5ZM2.15 3.74336H2.7V11.4434H2.15C1.23906 11.4434 0.5 10.7043 0.5 9.79336V5.39336C0.5 4.48242 1.23906 3.74336 2.15 3.74336ZM6.37715 1.43567C5.47176 1.43567 4.73779 2.16963 4.73779 3.07502V3.63043H9.51404V3.07502C9.51404 2.16963 8.78008 1.43567 7.87469 1.43567H6.37715Z" fill="#A7A9AC" />
                <circle cx="19" cy="19" r="13" fill="#E7E7E7" />
                <path d="M20.5073 10.25H19.2932C18.6937 11.9671 12.543 15.8882 12.543 16.0977C12.543 16.3597 12.871 24.7407 12.9138 25.4829C12.9566 26.225 15.5236 26.7489 15.8231 26.7489C16.0627 26.7489 22.3289 25.6256 25.0956 25.2036V14.625L20.5073 10.25Z" fill="#E7E7E7" />
                <path d="M25.2188 15.7188V15.5938H25.0938H20.5C19.928 15.5938 19.4766 15.1553 19.4766 14.625V10.25V10.125H19.3516H13.6094C12.2793 10.125 11.1875 11.1562 11.1875 12.4375V25.5625C11.1875 26.8438 12.2793 27.875 13.6094 27.875H22.7969C24.127 27.875 25.2188 26.8438 25.2188 25.5625V15.7188ZM20.5862 10.1595L20.375 9.95833V10.25V14.625V14.75H20.5H25.0938H25.4062L25.18 14.5345L20.5862 10.1595ZM15.332 19.125H21.0742C21.3268 19.125 21.5234 19.3208 21.5234 19.5469C21.5234 19.7729 21.3268 19.9688 21.0742 19.9688H15.332C15.0794 19.9688 14.8828 19.7729 14.8828 19.5469C14.8828 19.3208 15.0794 19.125 15.332 19.125ZM15.332 21.3125H21.0742C21.3268 21.3125 21.5234 21.5083 21.5234 21.7344C21.5234 21.9604 21.3268 22.1562 21.0742 22.1562H15.332C15.0794 22.1562 14.8828 21.9604 14.8828 21.7344C14.8828 21.5083 15.0794 21.3125 15.332 21.3125ZM15.332 23.5H21.0742C21.3268 23.5 21.5234 23.6958 21.5234 23.9219C21.5234 24.1479 21.3268 24.3438 21.0742 24.3438H15.332C15.0794 24.3438 14.8828 24.1479 14.8828 23.9219C14.8828 23.6958 15.0794 23.5 15.332 23.5Z" fill="#A7A9AC" stroke="#E7E7E7" strokeWidth="0.25" />
                <path d="M26.5381 19.2612L26.538 19.2613L23.5304 22.5494C23.4386 22.6498 23.4439 22.8053 23.5425 22.8992L23.7158 23.0642L24.7822 24.0798L24.9538 24.2433C25.0456 24.3307 25.1882 24.3356 25.2858 24.2547L28.7383 21.3919L28.7384 21.3918C29.0804 21.1078 29.2803 20.6922 29.2803 20.2537C29.2803 19.4123 28.5668 18.75 27.7139 18.75C27.2658 18.75 26.8367 18.9352 26.5381 19.2612ZM23.5091 22.8957C23.4414 22.8313 23.3438 22.8103 23.2563 22.8401L21.8939 23.1388C21.8938 23.1388 21.8938 23.1388 21.8937 23.1388C21.5241 23.2192 21.2226 23.4887 21.1172 23.8491C21.1172 23.8492 21.1172 23.8493 21.1172 23.8494L20.2875 26.6672C20.2556 26.7757 20.3005 26.8921 20.397 26.9511C20.4935 27.0101 20.6176 26.9969 20.6996 26.919L22.2908 25.4067C22.3575 25.3433 22.384 25.2485 22.3598 25.1598C22.3532 25.1352 22.3503 25.1146 22.3503 25.0938C22.3503 24.9623 22.465 24.8359 22.6335 24.8359C22.802 24.8359 22.9167 24.9623 22.9167 25.0938C22.9167 25.2252 22.802 25.3516 22.6335 25.3516C22.607 25.3516 22.5811 25.3481 22.5573 25.3419C22.4738 25.3205 22.3852 25.3436 22.3228 25.4031L20.7332 26.917C20.6504 26.9958 20.6316 27.1206 20.6875 27.2203C20.7434 27.3199 20.8597 27.369 20.9701 27.3396L23.9305 26.5494C23.9307 26.5494 23.9308 26.5493 23.9309 26.5493C24.2961 26.4524 24.5851 26.17 24.6728 25.8045C24.6728 25.8044 24.6728 25.8043 24.6729 25.8042L24.9926 24.4812C25.0136 24.3944 24.9867 24.303 24.9221 24.2415L24.7488 24.0764L23.6824 23.0608L23.5091 22.8957Z" fill="#E7E7E7" stroke="#A7A9AC" strokeWidth="0.5" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
          <i className={clsx('bi fs-3', fontIcon)}></i>
        )}
        <span className={clsx('menu-title',

        )

        }>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export { SidebarMenuItem }
