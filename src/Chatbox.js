import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ChatContext, socket } from './ChatContext'
import { CCard, CCardBody, CFormInput, CButton } from '@coreui/react'

const ChatBox = ({ selectedUser, onClose }) => {
  const { messages, addMessage } = useContext(ChatContext)
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        text: newMessage,
        isUser: true, // Indicate that the message is sent by the user
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
        style={{
          marginBottom: '10px',
          textAlign: msg.username === 'Admin' ? 'right' : 'left',
        }}
      >
        <strong>{msg.username}:</strong>
        <span
          style={{
            backgroundColor: msg.username === 'Admin' ? '#dcf8c6' : '#f0f0f0',
            padding: '10px',
            borderRadius: '15px',
            display: 'inline-block',
            marginLeft: msg.username === 'Admin' ? '10px' : '0',
            marginRight: msg.username === 'Admin' ? '0' : '10px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s',
          }}
        >
          {msg.text}
        </span>
      </div>
    ))

  return (
    <CCard
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '350px',
        zIndex: 1000,
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      }}
    >
      <CCardBody>
        <h5 style={{ marginBottom: '10px', textAlign: 'center' }}>Chat với {selectedUser}</h5>
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        >
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
          style={{
            borderRadius: '20px',
            border: '1px solid #ced4da',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '5px',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CButton
            onClick={handleSendMessage}
            color="primary"
            style={{
              borderRadius: '20px',
              flex: '1',
              marginRight: '5px',
            }}
          >
            Gửi
          </CButton>
          <CButton
            onClick={onClose}
            color="danger"
            style={{
              borderRadius: '20px',
              flex: '1',
            }}
          >
            Đóng
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  )
}

ChatBox.propTypes = {
  selectedUser: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ChatBox
