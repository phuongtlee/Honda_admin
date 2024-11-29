import React, { createContext, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import io from 'socket.io-client'

export const ChatContext = createContext()
export const socket = io('http://192.168.1.8:4000')

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [newMessageCount, setNewMessageCount] = useState(0)
  const messagesRef = useRef(messages)

  useEffect(() => {
    // const handleReceiveMessage = (data) => {
    //   console.log('Tin nhắn nhận được:', data)
    //   const messageData = {
    //     text: data.text,
    //     isUser: data.isUser !== undefined ? data.isUser : true,
    //     avatar: data.avatar || 1,
    //     username: data.username || 'User',
    //     timestamp: data.timestamp || new Date().toISOString(),
    //   }

    //   setMessages((prevMessages) => {
    //     const updatedMessages = [...prevMessages, messageData]
    //     messagesRef.current = updatedMessages
    //     return updatedMessages
    //   })
    //   setNewMessageCount((prevCount) => prevCount + 1)
    // }

    const handleReceiveMessage = (data) => {
      console.log('Tin nhắn nhận được:', data)
      const messageData = {
        text: data.text,
        isUser: data.isUser !== undefined ? data.isUser : true,
        avatar: data.avatar || 1,
        username: data.username || 'User',
        recipient: data.recipient || 'Admin', 
        timestamp: data.timestamp || new Date().toISOString(),
      }

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, messageData]
        messagesRef.current = updatedMessages
        return updatedMessages
      })
      setNewMessageCount((prevCount) => prevCount + 1)
    }

    socket.on('receive_message', handleReceiveMessage)

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message)
    })

    return () => {
      socket.off('receive_message', handleReceiveMessage)
    }
  }, [])

  const addMessage = (message) => {
    const messageWithTimestamp = {
      ...message,
      timestamp: new Date().toISOString(),
    }

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, messageWithTimestamp]
      messagesRef.current = updatedMessages
      return updatedMessages
    })
  }

  const removeMessage = (index) => {
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter((_, i) => i !== index)
      messagesRef.current = updatedMessages
      return updatedMessages
    })
  }

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, removeMessage, newMessageCount, setNewMessageCount }}
    >
      {children}
    </ChatContext.Provider>
  )
}

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ChatProvider
