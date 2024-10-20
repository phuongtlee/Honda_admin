import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ChatContext, socket } from './ChatContext' // Ensure correct import path
import { CCard, CCardBody, CFormInput, CButton } from '@coreui/react'

const ChatBox = ({ selectedUser, onClose }) => {
  const { messages, addMessage } = useContext(ChatContext)
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        isUser: false, // Đặt thành false cho tin nhắn của admin
        username: 'Admin',
        recipient: selectedUser,
      }

      console.log('Đang gửi tin nhắn:', messageData)
      addMessage(messageData)
      socket.emit('send_message', messageData)
      setNewMessage('')
    } else {
      console.warn('Nội dung tin nhắn trống, không gửi được.')
    }
  }

  const userMessages = messages
    .filter(
      (msg) =>
        (msg.username === selectedUser && msg.recipient === 'Admin') ||
        (msg.username === 'Admin' && msg.recipient === selectedUser),
    )
    .map((msg, index) => (
      <div
        key={index}
        style={{ marginBottom: '10px', textAlign: msg.username === 'Admin' ? 'right' : 'left' }}
      >
        <strong>{msg.username}:</strong>
        <span
          style={{
            backgroundColor: msg.username === 'Admin' ? '#dcf8c6' : '#f0f0f0',
            padding: '8px',
            borderRadius: '5px',
            display: 'inline-block',
            marginLeft: msg.username === 'Admin' ? '10px' : '0',
            marginRight: msg.username === 'Admin' ? '0' : '10px',
          }}
        >
          {msg.text}
        </span>
      </div>
    ))

  return (
    <CCard
      style={{ position: 'fixed', bottom: '20px', right: '20px', width: '300px', zIndex: 1000 }}
    >
      <CCardBody>
        <h5>Chat với {selectedUser}</h5>
        <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
          {userMessages}
        </div>
        <CFormInput
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />
        <CButton onClick={handleSendMessage} color="primary" style={{ marginTop: '5px' }}>
          Gửi
        </CButton>
        <CButton onClick={onClose} color="danger" style={{ marginTop: '5px' }}>
          Đóng
        </CButton>
      </CCardBody>
    </CCard>
  )
}

// Define PropTypes for ChatBox
ChatBox.propTypes = {
  selectedUser: PropTypes.string.isRequired, // selectedUser is required and must be a string
  onClose: PropTypes.func.isRequired, // onClose is required and must be a function
}

export default ChatBox
