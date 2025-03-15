import { FC, FormEvent } from 'react';

interface MessageInputProps {
    onSend: (message: string) => void;
    username: string;
}

export const MessageInput: FC<MessageInputProps> = ({ onSend, username }) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const textarea = form.elements.namedItem('message') as HTMLTextAreaElement;
        
        if (textarea.value.trim()) {
            onSend(textarea.value);
            textarea.value = '';
        }
    };

    return (
        <div className="chat-input">
            <form onSubmit={handleSubmit}>
                <label htmlFor="message">Press <strong>Enter</strong> to send</label>
                <textarea
                    name="message"
                    id="message"
                    placeholder={`Hello ${username}! Enter your message here`}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            e.currentTarget.form?.requestSubmit();
                        }
                    }}
                />
            </form>
        </div>
    );
};
