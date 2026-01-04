import { NextRequest } from 'next/server';
import { 
  isUserRateLimited, 
  saveMessage, 
  getRecentMessages, 
  isValidUsername, 
  moderateMessage,
  ChatMessage
} from '@/lib/chat-service';

export async function POST(request: NextRequest) {
  try {
    const { userId, username, message } = await request.json();
    
    // Validate required fields
    if (!userId || !username || !message) {
      return Response.json({ error: 'Missing required fields: userId, username, message' }, { status: 400 });
    }

    // Validate username
    if (!isValidUsername(username)) {
      return Response.json({ error: 'Invalid username' }, { status: 400 });
    }

    // Check for rate limiting
    if (await isUserRateLimited(userId)) {
      return Response.json({ error: 'Rate limit exceeded. Please wait before sending another message.' }, { status: 429 });
    }

    // Moderate the message
    const moderationResult = moderateMessage(message);
    if (!moderationResult.isAllowed) {
      return Response.json({ error: 'Message contains inappropriate content' }, { status: 400 });
    }

    // Create the chat message object
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId,
      username,
      message: moderationResult.cleanedMessage,
      timestamp: new Date(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };

    // Save the message
    await saveMessage(chatMessage);

    // Return success
    return Response.json({ 
      success: true, 
      message: chatMessage 
    });
  } catch (error) {
    console.error('Error handling chat message:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const messages = await getRecentMessages(limit);
    
    return Response.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}