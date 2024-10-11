import React, { useContext, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CButton, CFormInput } from '@coreui/react'
import { ChatContext, socket } from '../../ChatContext' // Nhập socket ở đây

const ChatComponent = () => {
  const { messages, addMessage, removeMessage } = useContext(ChatContext)
  const [inputText, setInputText] = useState('')
  const [username, setUsername] = useState('Admin') // Tên người dùng mặc định

  const handleSend = () => {
    if (inputText.trim()) {
      const messageData = {
        text: inputText,
        isUser: false,
        avatar: 1,
        username: username,
      }
      console.log('Gửi tin nhắn:', messageData)
      addMessage(messageData) // Thêm tin nhắn vào context
      socket.emit('send_message', messageData) // Gửi tin nhắn qua socket
      setInputText('') // Xóa input sau khi gửi tin nhắn
    } else {
      console.warn('Input text is empty, message not sent.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const handleRemoveMessage = (index) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      removeMessage(index)
    }
  }

  return (
    <CCard>
      <CCardHeader>Chat Room</CCardHeader>
      <CCardBody>
        <div
          style={{
            height: '300px',
            overflowY: 'scroll',
            marginBottom: '20px',
            border: '1px solid #ccc',
            padding: '10px',
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{ marginBottom: '10px', textAlign: msg.isUser ? 'left' : 'right' }}
            >
              <strong>{msg.username}: </strong>
              <span
                style={{
                  backgroundColor: msg.isUser ? '#dcf8c6' : '#f0f0f0',
                  padding: '8px',
                  borderRadius: '5px',
                  display: 'inline-block',
                  marginLeft: msg.isUser ? '10px' : '0',
                  marginRight: msg.isUser ? '0' : '10px',
                }}
              >
                {msg.text}
              </span>
              <CButton size="sm" onClick={() => handleRemoveMessage(index)}>
                Xóa
              </CButton>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          <CFormInput
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{ flex: 1, marginRight: '10px' }}
          />
          <CButton onClick={handleSend}>Gửi</CButton>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default ChatComponent
