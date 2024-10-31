import React, { useContext, useState, useEffect } from 'react'
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
import '../../css/MessageManagement.css'

const MessageManagement = () => {
  const { messages } = useContext(ChatContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [groupedMessages, setGroupedMessages] = useState({})
  const [newMessageCount, setNewMessageCount] = useState(0)
  const [newMessageSenders, setNewMessageSenders] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAllMessages, setShowAllMessages] = useState(false)
  const [userMessages, setUserMessages] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const grouped = messages.reduce((groups, message) => {
      const { username } = message

      if (username === 'Admin') {
        return groups
      }

      if (!groups[username]) {
        groups[username] = []
      }
      groups[username].push(message)
      return groups
    }, {})

    setGroupedMessages(grouped)

    const senders = Object.keys(grouped).filter((username) => grouped[username].length > 0)

    // Chỉ cập nhật khi có tin nhắn mới
    if (senders.length > 0) {
      setNewMessageCount(messages.length)
      setNewMessageSenders(senders)
    } else {
      setNewMessageCount(0)
      setNewMessageSenders([])
    }
  }, [messages])

  useEffect(() => {
    // Reset thông báo khi chuyển về màn hình chat
    if (selectedUser) {
      setNewMessageCount(0)
      setNewMessageSenders([])
    }
  }, [selectedUser])

  // Reset thông báo khi component được hiển thị
  useEffect(() => {
    setNewMessageCount(0)
    setNewMessageSenders([])
  }, [])

  const handleSelectChat = (username) => {
    setSelectedUser(username)
    setNewMessageCount((prev) => prev - (groupedMessages[username]?.length || 0))
    setIsChatOpen(true)
  }

  const handleCloseChatBox = () => {
    setSelectedUser(null)
    setIsChatOpen(false)
  }

  const handleViewAllMessages = (username) => {
    setUserMessages(groupedMessages[username])
    setShowAllMessages(true)
    setNewMessageCount(0)
    setNewMessageSenders([])
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
          <small>{new Date(msg.timestamp).toLocaleString()}</small>
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
      const date = new Date(msg.timestamp)
      return (
        <CListGroupItem key={index}>
          <strong>{msg.username}:</strong> <span>{msg.text}</span>
          <div>
            <small>{date.toLocaleString()}</small>
          </div>
        </CListGroupItem>
      )
    })
  }

  return (
    <>
      <CCard className="message-management">
        <CCardHeader className="message-management-header">Quản lý tin nhắn</CCardHeader>
        <CCardBody>
          <CFormInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo người gửi hoặc nội dung..."
            className="message-management-search"
          />
          {!isChatOpen && newMessageCount > 0 && newMessageSenders.length > 0 && (
            <CAlert className="message-alert" color="warning">
              <span>⚠️</span>
              Có {newMessageCount} tin nhắn mới từ: {newMessageSenders.join(' và ')}!
            </CAlert>
          )}
          <CListGroup className="message-list">{renderMessages()}</CListGroup>
        </CCardBody>
      </CCard>
      {selectedUser && <ChatBox selectedUser={selectedUser} onClose={handleCloseChatBox} />}
      {showAllMessages && (
        <CCard className="chat-box">
          <CCardHeader className="chat-box-header">
            <strong>Tất cả tin nhắn của {selectedUser}</strong>
            <CButton
              color="danger"
              onClick={() => setShowAllMessages(false)}
              className="chat-box-close-button"
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
