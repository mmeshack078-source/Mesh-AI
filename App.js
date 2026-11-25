import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

// WEKA URL YA BACKEND YAKO HAPA (Mfano: https://your-api.com/chat)
const API_URL = '';

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const suggestions = [
    'Explain something to me',
    'Write a professional CV',
    'Help me write code',
    'Give me business ideas',
  ];

  const handleNewChat = () => {
    setMessages([]);
    setMessage('');
    setLoading(false);
  };

  const handleSend = async (customText) => {
    const textToSend = (customText ?? message).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      let replyText = '';

      if (!API_URL) {
        // Simulation mpaka utakapoweka API_URL yako hapo juu
        await new Promise((resolve) => setTimeout(resolve, 800));
        replyText = `MeshAI: Nimepokea "${textToSend}". Weka API_URL yako hapo juu ili nipate majibu halisi kutoka kwenye server!`;
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: textToSend,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        // Badilisha data.reply kulingana na muundo wa JSON wa API yako
        replyText = data.reply || data.response || data.text || 'Hakuna jibu lililorudishwa.';
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          sender: 'ai',
          text: 'Hitilafu ya mtandao: Imeshindwa kuunganisha na server ya MeshAI.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#101321" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>✦ MeshAI</Text>
        <TouchableOpacity style={styles.newChat} onPress={handleNewChat}>
          <Text style={styles.newChatText}>＋ New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content: Inaonyesha Hero kama hakuna chat, au Messages kama chat imeanza */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.content,
          messages.length > 0 && styles.chatContent,
        ]}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.length === 0 ? (
          <>
            <View style={styles.hero}>
              <Text style={styles.icon}>✧</Text>
              <Text style={styles.title}>Hello, I'm MeshAI.</Text>
              <Text style={styles.subtitle}>
                Your intelligent AI assistant.{'\n'}
                What would you like to explore today?
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Explore your ideas</Text>

            {suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestion}
                onPress={() => handleSend(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.footer}>Powered by MeshAI Technology</Text>
          </>
        ) : (
          <>
            {messages.map((item) => {
              const isUser = item.sender === 'user';
              return (
                <View
                  key={item.id}
                  style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  {!isUser && <Text style={styles.aiTag}>✦ MeshAI</Text>}
                  <Text style={styles.bubbleText}>{item.text}</Text>
                </View>
              );
            })}

            {loading && (
              <View style={[styles.bubble, styles.aiBubble, styles.loadingRow]}>
                <ActivityIndicator size="small" color="#8B7CFF" />
                <Text style={styles.loadingText}>MeshAI inafikiri...</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ask MeshAI anything..."
          placeholderTextColor="#8990A5"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.send, (!message.trim() || loading) && styles.sendDisabled]}
          onPress={() => handleSend()}
          disabled={!message.trim() || loading}
        >
          <Text style={styles.sendText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101321',
  },
  header: {
    padding: 20,
    paddingTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#292D40',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
  },
  newChat: {
    backgroundColor: '#292D40',
    padding: 10,
    borderRadius: 12,
  },
  newChatText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 25,
  },
  chatContent: {
    paddingTop: 20,
    flexGrow: 1,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 45,
  },
  icon: {
    color: '#8B7CFF',
    fontSize: 55,
    marginBottom: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#A4A9BA',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  suggestion: {
    backgroundColor: '#1D2234',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    color: '#E5E7F0',
    fontSize: 14,
  },
  arrow: {
    color: '#8B7CFF',
    fontSize: 20,
  },
  footer: {
    color: '#727990',
    textAlign: 'center',
    marginTop: 30,
  },
  bubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#7965FF',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1D2234',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#292D40',
  },
  aiTag: {
    color: '#8B7CFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bubbleText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#A4A9BA',
    fontSize: 14,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: '#292D40',
  },
  input: {
    flex: 1,
    backgroundColor: '#1D2234',
    color: '#FFFFFF',
    borderRadius: 15,
    padding: 14,
    maxHeight: 100,
  },
  send: {
    backgroundColor: '#7965FF',
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
  },
  sendDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
