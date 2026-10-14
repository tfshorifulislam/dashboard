"use client"

import * as React from "react"
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  FolderKanban,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDashboard } from "@/context/dashboard-context"

export default function MessagesPage() {
  const { conversations, sendMessage } = useDashboard()
  const [activeId, setActiveId] = React.useState<string>(conversations[0]?.id || "conv-1")
  const [inputText, setInputText] = React.useState("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeId) || conversations[0]

  const filteredConversations = conversations.filter(
    (c) =>
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeConversation) return

    sendMessage(activeConversation.id, inputText.trim())
    setInputText("")
  }

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation?.messages])

  return (
    <DashboardShell>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Messages & Client Communication</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Direct client messaging, scope clarification, and file sharing in real time.
        </p>
      </div>

      {/* 2-Pane Messenger Shell */}
      <div className="grid grid-cols-1 md:grid-cols-12 bg-card rounded-2xl border border-border shadow-sm overflow-hidden min-h-[640px] h-[calc(100vh-220px)]">
        {/* Left: Threads list */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-border flex flex-col bg-muted/20">
          <div className="p-3.5 border-b border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Conversations
              </span>
              <Badge variant="secondary" className="bg-blue-100/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs">
                {conversations.length} Active
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-background border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1]
              const isSelected = conv.id === activeId

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-l-blue-600"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        {conv.clientName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {conv.clientName}
                      </h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {lastMsg ? (lastMsg.time || lastMsg.timestamp) : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      <FolderKanban className="h-3 w-3 shrink-0" />
                      <span className="truncate">{conv.projectName}</span>
                    </div>

                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && !isSelected && (
                    <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col bg-card">
          {activeConversation ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-3.5 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs font-bold bg-gradient-to-tr from-[#14265C] to-[#2447A8] text-white">
                      {activeConversation.clientName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {activeConversation.clientName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Project: <span className="text-blue-600 dark:text-blue-400 font-medium">{activeConversation.projectName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Message Bubbles Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/10">
                {activeConversation.messages.map((msg) => {
                  const isAgency = msg.sender === "user" || msg.sender === "Alex Morgan" || msg.sender === "Agency Team"

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAgency ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {msg.senderName || (isAgency ? "Alex Morgan (Agency)" : activeConversation.clientName)}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70">{msg.time || msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isAgency
                            ? "bg-gradient-to-r from-[#14265C] to-[#2447A8] text-white rounded-br-xs"
                            : "bg-card border border-border text-foreground rounded-bl-xs"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {isAgency && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                          <span>Delivered</span>
                        </div>
                      )}
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Composer */}
              <form onSubmit={handleSend} className="p-3 border-t border-border bg-card">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                    title="Attach asset"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>

                  <Input
                    placeholder={`Message ${activeConversation.clientName}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 h-10 text-xs sm:text-sm bg-muted/40 border-input text-foreground placeholder:text-muted-foreground rounded-xl"
                  />

                  <Button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="h-10 px-4 bg-gradient-to-r from-[#14265C] to-[#2447A8] hover:from-[#0E1B42] hover:to-[#1B3580] text-white rounded-xl shadow-xs transition-all shrink-0"
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    <span>Send</span>
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs">
              Select a conversation to begin chatting
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
