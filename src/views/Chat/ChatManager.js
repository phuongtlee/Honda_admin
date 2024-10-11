import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../ChatContext'
import { CCard, CCardBody, CCardHeader, CFormInput, CButton, CAlert } from '@coreui/react'

const MessageManagement = () => {
  const { messages } = useContext(ChatContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [groupedMessages, setGroupedMessages] = useState({})
  const [newMessageCount, setNewMessageCount] = useState(0)
  const navigate = useNavigate()

  // Nhóm tin nhắn theo người dùng
  useEffect(() => {
    const grouped = messages.reduce((groups, message) => {
      const { userId } = message
      if (!groups[userId]) {
        groups[userId] = []
      }
      groups[userId].push(message)
      return groups
    }, {})

    setGroupedMessages(grouped)
    setNewMessageCount(messages.length) // Cập nhật số lượng tin nhắn mới
  }, [messages])

  const handleDeleteMessage = (userId, messageId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      console.log(`Xóa tin nhắn với ID: ${messageId} của người dùng với ID: ${userId}`)
      // Thực hiện logic xóa tin nhắn ở đây
      setGroupedMessages((prev) => {
        const updatedGroups = { ...prev }
        updatedGroups[userId] = updatedGroups[userId].filter((msg) => msg.id !== messageId)
        return updatedGroups
      })
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getHours()}:${date.getMinutes()} ${date.toLocaleDateString()}`
  }

  const handleSelectChat = (userId) => {
    navigate(`/chat/${userId}`)
    setNewMessageCount((prev) => prev - (groupedMessages[userId]?.length || 0)) // Giảm số lượng tin nhắn mới khi vào cuộc trò chuyện
  }

  const filteredMessages = () => {
    return Object.entries(groupedMessages).flatMap(([userId, msgs]) =>
      msgs.filter((msg) => {
        const lowerSearchTerm = searchTerm.toLowerCase()
        return (
          msg.username.toLowerCase().includes(lowerSearchTerm) ||
          msg.text.toLowerCase().includes(lowerSearchTerm)
        )
      }),
    )
  }

  const renderMessages = () => {
    const messagesToRender = filteredMessages()
    if (messagesToRender.length === 0) {
      return <div>Không tìm thấy tin nhắn nào.</div>
    }
    return messagesToRender.map((msg) => (
      <div
        key={msg.id}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f9f9f9',
          borderRadius: '5px',
        }}
      >
        <div>
          <strong>{msg.username}: </strong>
          <span>{msg.text} </span>
          <span style={{ fontSize: 'small', color: 'gray' }}>{formatTimestamp(msg.timestamp)}</span>
        </div>
        <CButton color="danger" onClick={() => handleDeleteMessage(msg.userId, msg.id)}>
          Xóa
        </CButton>
      </div>
    ))
  }

  return (
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
        <div style={{ margin: '10px 0' }}>
          {Object.keys(groupedMessages).map((userId) => (
            <CButton
              key={userId}
              onClick={() => handleSelectChat(userId)}
              color="primary"
              style={{ marginRight: '5px', marginBottom: '5px' }}
            >
              Chat với người dùng ID: {userId}
            </CButton>
          ))}
        </div>

        <div
          style={{
            marginTop: '20px',
            maxHeight: '400px',
            overflowY: 'scroll',
            border: '1px solid #ccc',
            padding: '10px',
          }}
        >
          {renderMessages()}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default MessageManagement
