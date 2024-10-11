import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import io from 'socket.io-client'

// Tạo ngữ cảnh chat (ChatContext)
export const ChatContext = createContext()
export const socket = io('http://192.168.1.7:4000') // Khởi tạo socket

// Tạo thành phần cung cấp ngữ cảnh
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [newMessageCount, setNewMessageCount] = useState(0) // Biến trạng thái để theo dõi số lượng tin nhắn mới

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log('Tin nhắn nhận được:', data)
      const messageData = {
        text: data.text,
        isUser: data.isUser !== undefined ? data.isUser : true,
        avatar: data.avatar || 1,
        username: data.username || 'User',
      }

      // Kiểm tra xem tin nhắn đã có trong danh sách chưa
      const isDuplicate = messages.some(
        (msg) => msg.text === messageData.text && msg.username === messageData.username,
      )
      if (!isDuplicate) {
        setMessages((prevMessages) => [...prevMessages, messageData])
        setNewMessageCount((prevCount) => prevCount + 1) // Tăng số lượng tin nhắn mới
      } else {
        console.warn('Tin nhắn bị trùng:', messageData.text)
      }
    }

    // Đăng ký sự kiện nhận tin nhắn
    socket.on('receive_message', handleReceiveMessage)

    // Dọn dẹp khi component unmount
    return () => {
      socket.off('receive_message', handleReceiveMessage)
    }
  }, [messages])

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  const removeMessage = (index) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index))
  }

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, removeMessage, newMessageCount, setNewMessageCount }}
    >
      {children}
    </ChatContext.Provider>
  )
}

// Xác thực kiểu cho props
ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ChatProvider
