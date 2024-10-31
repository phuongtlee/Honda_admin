import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

// sidebar nav config
import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand
          to="/"
          className="d-flex align-items-center"
          style={{ textDecoration: 'none' }}
        >
          <span
            className="sidebar-brand-full"
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#FFD700',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
              padding: '10px 0px',
              whiteSpace: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '150px',
              textDecoration: 'none',
            }}
          >
            Cửa hàng xe Phương Thanh
          </span>
          <span
            className="sidebar-brand-narrow"
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#FFD700',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
              padding: '10px 15px',
              whiteSpace: 'normal',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '50px',
              textDecoration: 'none',
            }}
          >
            PT
          </span>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          style={{ textDecoration: 'none' }} // Bỏ gạch chân cho nút đóng
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
