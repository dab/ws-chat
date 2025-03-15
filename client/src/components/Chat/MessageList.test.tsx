import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageList } from './MessageList';

describe('MessageList', () => {
  const mockMessages = [
    { name: 'user1', message: 'Hello', timestamp: 1 },
    { name: 'user2', message: 'Hi there', timestamp: 2 }
  ];

  it('renders messages correctly', () => {
    render(<MessageList messages={mockMessages} currentUser="user1" />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
  });

  it('applies self class to current user messages', () => {
    render(<MessageList messages={mockMessages} currentUser="user1" />);
    
    const userMessage = screen.getByText('Hello').closest('.chat-message');
    const otherMessage = screen.getByText('Hi there').closest('.chat-message');

    expect(userMessage).toHaveClass('self');
    expect(otherMessage).not.toHaveClass('self');
  });

  it('renders empty state when no messages', () => {
    render(<MessageList messages={[]} currentUser="user1" />);
    
    expect(screen.queryByRole('message')).not.toBeInTheDocument();
  });

});
