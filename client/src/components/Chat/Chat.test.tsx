import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatLayout } from './Chat';

describe('ChatLayout', () => {
  const mockProps = {
    messages: [
      { name: 'user1', message: 'Hello', timestamp: 1 },
      { name: 'user2', message: 'Hi', timestamp: 2 }
    ],
    username: 'user1',
    userList: ['user1', 'user2'],
    onSendMessage: vi.fn()
  };

  it('renders all components correctly', () => {
    render(<ChatLayout {...mockProps} />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/online users/i)).toBeInTheDocument();
  });

  it('shows correct number of online users', () => {
    render(<ChatLayout {...mockProps} />);
    
    expect(screen.getByText('Online Users (2)')).toBeInTheDocument();
  });
});
