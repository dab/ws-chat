import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageInput } from './MessageInput';

describe('MessageInput', () => {
  const mockOnSend = vi.fn();
  const username = 'testUser';

  beforeEach(() => {
    mockOnSend.mockClear();
  });

  it('renders input field and send text', () => {
    render(<MessageInput onSend={mockOnSend} username={username} />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByLabelText(/press.*enter.*to send/i)).toBeInTheDocument();
  });

  it('calls onSend when submitting non-empty message', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSend={mockOnSend} username={username} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello World');
    await user.keyboard('{Enter}');

    expect(mockOnSend).toHaveBeenCalledWith('Hello World');
  });

  it('does not call onSend when submitting empty message', async () => {
    const user = userEvent.setup();
    render(<MessageInput onSend={mockOnSend} username={username} />);
    
    await user.keyboard('{Enter}');

    expect(mockOnSend).not.toHaveBeenCalled();
  });
});
