'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Plus, LogIn, RefreshCw } from 'lucide-react'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
}

export default function RoomPage() {
  const [action, setAction] = useState<'create' | 'join' | null>(null)
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [roomId, setRoomId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isInRoom, setIsInRoom] = useState(false)
  const [userName, setUserName] = useState('')
  const socketRef = useRef<WebSocket | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const connectWebSocket = (roomIdToJoin: string, passwordToUse: string) => {
    setIsConnecting(true)
    setError(null)
    const socketUrl = process.env.WEBSOCKET_LINK || 'ws://localhost:8080';
    socketRef.current = new WebSocket(socketUrl)

    socketRef.current.onopen = () => {
      console.log('Connected to WebSocket server')
      socketRef.current?.send(JSON.stringify({ type: 'SET_NAME', name: userName }))
    }

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'NAME_SET':
          if (action === 'create') {
            socketRef.current?.send(JSON.stringify({ type: 'CREATE_ROOM', password: passwordToUse }))
          } else {
            socketRef.current?.send(JSON.stringify({ type: 'JOIN_ROOM', roomId: roomIdToJoin, password: passwordToUse }))
          }
          break
        case 'ROOM_CREATED':
        case 'ROOM_JOINED':
          setRoomId(data.roomId)
          setIsInRoom(true)
          setIsConnecting(false)
          break
        case 'CHAT_MESSAGE':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: data.sender,
            content: data.content,
            timestamp: new Date(data.timestamp)
          }])
          break
        case 'ERROR':
          setError(data.message)
          setIsConnecting(false)
          break
      }
    }

    socketRef.current.onerror = () => {
      console.error('WebSocket error occurred')
      setError('Connection error. Please try again.')
      setIsConnecting(false)
    }

    socketRef.current.onclose = () => {
      console.log('Disconnected from WebSocket server')
      setIsConnecting(false)
      setIsInRoom(false)
      setRoomId(null)
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) {
      setError('Please enter your name.')
      return
    }
    if (action === 'create') {
      connectWebSocket('', password)
    } else if (action === 'join') {
      connectWebSocket(roomName, password)
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() && socketRef.current && socketRef.current.readyState === WebSocket.OPEN && roomId) {
      socketRef.current.send(JSON.stringify({
        type: 'CHAT_MESSAGE',
        roomId: roomId,
        content: inputMessage
      }))
      setInputMessage('')
    } else {
      setError('Unable to send message. Please make sure you are connected to a room.')
    }
  }

  const handleRetryConnection = () => {
    if (roomId) {
      connectWebSocket(roomId, password)
    } else {
      setError('Unable to reconnect. Please try creating or joining a room again.')
      setIsInRoom(false)
    }
  }

  if (!isInRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-900 via-sky-900 to-purple-800 p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-xl rounded-lg">
          <CardHeader>
            <h1 className="text-3xl font-bold text-center text-gray-100">
              {action === 'create' ? 'Create Room' : action === 'join' ? 'Join Room' : 'Choose Action'}
            </h1>
          </CardHeader>
          <CardContent>
            {!action ? (
              <div className="flex flex-col gap-4">
                <Button onClick={() => setAction('create')} className="bg-teal-500 text-gray-100 hover:bg-teal-600 rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
                <Button onClick={() => setAction('join')} className="bg-sky-500 text-gray-100 hover:bg-sky-600 rounded-lg">
                  <LogIn className="w-4 h-4 mr-2" />
                  Join Room
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="userName" className="text-gray-300">Your Name</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="bg-gray-800 text-gray-100 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor={action === 'create' ? 'roomName' : 'roomId'} className="text-gray-300">
                    {action === 'create' ? 'Room Name' : 'Room ID'}
                  </Label>
                  <Input
                    id={action === 'create' ? 'roomName' : 'roomId'}
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder={action === 'create' ? 'Enter room name' : 'Enter room ID'}
                    required
                    className="bg-gray-800 text-gray-100 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="bg-gray-800 text-gray-100 border-gray-700"
                  />
                </div>
                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-gray-100" disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : action === 'create' ? 'Create Room' : 'Join Room'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-teal-900 via-sky-900 to-purple-800 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col bg-gray-900 border-gray-800 shadow-xl rounded-lg">
        <CardHeader>
          <h1 className="text-3xl font-bold text-center text-gray-100">Chat Room: {roomId}</h1>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === userName ? 'justify-end' : 'justify-start'} items-start`}
              >
                <div className={`flex flex-col ${message.sender === userName ? 'bg-teal-500 text-gray-100' : 'bg-gray-700 text-gray-300'} rounded-lg p-3 w-full max-w-md shadow-md`}>
                  <p className="font-semibold text-lg mb-1">{message.sender}</p>
                  <p className="text-base whitespace-pre-wrap break-words">{message.content}</p>
                  <p className="text-xs text-gray-800 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={sendMessage} className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
            />
            <Button type="submit" disabled={!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN} className="bg-teal-500 hover:bg-teal-600 text-gray-100">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
      {error && (
        <div className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center shadow-xl">
          <p className="mr-2">{error}</p>
          <Button onClick={handleRetryConnection} variant="secondary" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}
    </div>
  )
}
