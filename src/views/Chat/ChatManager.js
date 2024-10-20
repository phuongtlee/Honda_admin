import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../ChatContext'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
  CAlert,
  CFormInput,
  CButton,
} from '@coreui/react'
import ChatBox from '../../Chatbox'

const MessageManagement = () => {
  const { messages } = useContext(ChatContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [groupedMessages, setGroupedMessages] = useState({})
  const [newMessageCount, setNewMessageCount] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAllMessages, setShowAllMessages] = useState(false)
  const [userMessages, setUserMessages] = useState([])
  const navigate = useNavigate()

  // Lấy thời gian hiện tại
  const currentDate = new Date()

  useEffect(() => {
    const grouped = messages.reduce((groups, message) => {
      const { username } = message
      if (!groups[username]) {
        groups[username] = []
      }
      groups[username].push(message)
      return groups
    }, {})

    setGroupedMessages(grouped)
    setNewMessageCount(messages.length)
  }, [messages])

  const handleSelectChat = (username) => {
    setSelectedUser(username)
    setNewMessageCount((prev) => prev - (groupedMessages[username]?.length || 0))
  }

  const handleCloseChatBox = () => {
    setSelectedUser(null)
  }

  const handleViewAllMessages = (username) => {
    setUserMessages(groupedMessages[username])
    setShowAllMessages(true)
  }

  const filteredMessages = () => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    return Object.entries(groupedMessages)
      .flatMap(([username, msgs]) => {
        const lastMessage = msgs[msgs.length - 1]
        return lastMessage &&
          (username.toLowerCase().includes(lowerSearchTerm) ||
            lastMessage.text.toLowerCase().includes(lowerSearchTerm))
          ? {
              username,
              text: lastMessage.text,
              timestamp: lastMessage.timestamp,
              count: msgs.length,
            }
          : null
      })
      .filter(Boolean)
  }

  const renderMessages = () => {
    const messagesToRender = filteredMessages()
    if (messagesToRender.length === 0) {
      return <div>Không tìm thấy tin nhắn nào.</div>
    }
    return messagesToRender.map((msg) => (
      <CListGroupItem
        key={msg.username}
        onClick={() => handleSelectChat(msg.username)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div>
          <strong>{msg.username}:</strong>
          <span>{msg.text}</span>
          {msg.count > 1 && <span style={{ marginLeft: '10px' }}>({msg.count} tin nhắn)</span>}
        </div>
        <div>
          <small>{new Date(msg.timestamp).toLocaleString()}</small> {/* Hiển thị thời gian gửi */}
          <CButton
            color="info"
            onClick={(e) => {
              e.stopPropagation()
              handleViewAllMessages(msg.username)
            }}
            style={{ marginLeft: '10px' }}
          >
            Xem toàn bộ tin nhắn
          </CButton>
        </div>
      </CListGroupItem>
    ))
  }

  const renderAllMessages = () => {
    if (userMessages.length === 0) {
      return <div>Không có tin nhắn nào.</div>
    }

    const sortedMessages = [...userMessages].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    )

    return sortedMessages.map((msg, index) => {
      const timestamp = msg.timestamp
      console.log(msg)

      if (!timestamp) {
        console.error('Ngày không hợp lệ: undefined hoặc không có giá trị cho tin nhắn:', msg)
        return (
          <CListGroupItem key={index}>
            <strong>{msg.username}:</strong> <span>{msg.text}</span>
            <div>
              <small>Không có thông tin ngày giờ</small>
            </div>
          </CListGroupItem>
        )
      }

      const date = new Date(timestamp)
      if (isNaN(date.getTime())) {
        console.error('Ngày không hợp lệ:', timestamp)
        console.log(timestamp)
        return (
          <CListGroupItem key={index}>
            <strong>{msg.username}:</strong> <span>{msg.text}</span>
            <div>
              <small>Ngày không hợp lệ</small>
            </div>
          </CListGroupItem>
        )
      }

      return (
        <CListGroupItem key={index}>
          <strong>{msg.username}:</strong> <span>{msg.text}</span>
          <div>
            <small>{date.toLocaleString()}</small> {/* Hiển thị thời gian gửi */}
          </div>
        </CListGroupItem>
      )
    })
  }

  return (
    <>
      <CCard>
        <CCardHeader>Quản lý tin nhắn</CCardHeader>
        <CCardBody>
          <CFormInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo người gửi hoặc nội dung..."
          />
          {newMessageCount > 0 && <CAlert color="info">Có {newMessageCount} tin nhắn mới!</CAlert>}
          <CListGroup>{renderMessages()}</CListGroup>

          {/* Hiển thị thời gian hiện tại */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <strong>Thời gian hiện tại: </strong>
            {currentDate.toLocaleString()} {/* Chuyển đổi thời gian thành định dạng địa phương */}
          </div>
        </CCardBody>
      </CCard>
      {selectedUser && <ChatBox selectedUser={selectedUser} onClose={handleCloseChatBox} />}

      {showAllMessages && (
        <CCard
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            zIndex: 1000,
          }}
        >
          <CCardHeader>
            <strong>Tất cả tin nhắn của {selectedUser}</strong>
            <CButton
              color="danger"
              onClick={() => setShowAllMessages(false)}
              style={{ float: 'right' }}
            >
              Đóng
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CListGroup>{renderAllMessages()}</CListGroup>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default MessageManagement
