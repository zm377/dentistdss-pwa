import { test, expect, Page } from '@playwright/test';

/**
 * Floating Chat Helper E2E Tests
 * 
 * Tests the complete user interaction flow with the floating chat helper component
 */

test.describe('Floating Chat Helper E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page where the floating chat helper should be visible
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test.describe('Initial State and Visibility', () => {
    test('should display floating chat button on homepage', async ({ page }) => {
      // Check if the floating chat button is visible
      const chatButton = page.getByRole('button', { name: /chat/i });
      await expect(chatButton).toBeVisible();
      
      // Verify the button has the help icon
      const helpIcon = chatButton.locator('svg');
      await expect(helpIcon).toBeVisible();
    });

    test('should show tooltip on hover', async ({ page }) => {
      const chatButton = page.getByRole('button', { name: /chat/i });
      
      // Hover over the button
      await chatButton.hover();
      
      // Check for tooltip
      await expect(page.getByText('Chat with AI Assistant')).toBeVisible();
    });

    test('should not show chat dialog initially', async ({ page }) => {
      // Chat dialog should not be visible initially
      await expect(page.getByText('Help Assistant')).not.toBeVisible();
    });
  });

  test.describe('Chat Dialog Interaction', () => {
    test('should open chat dialog when button is clicked', async ({ page }) => {
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      // Check if dialog opened
      await expect(page.getByText('Help Assistant')).toBeVisible();
      await expect(page.getByText('Hi there! How can I help you today?')).toBeVisible();
      
      // Check if input field and send button are visible
      await expect(page.getByPlaceholder('Type your message...')).toBeVisible();
      await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
    });

    test('should close chat dialog when close button is clicked', async ({ page }) => {
      // Open dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      // Close dialog
      const closeButton = page.getByRole('button', { name: /close chat/i });
      await closeButton.click();
      
      // Verify dialog is closed
      await expect(page.getByText('Help Assistant')).not.toBeVisible();
    });

    test('should maintain dialog state when reopened', async ({ page }) => {
      const chatButton = page.getByRole('button', { name: /chat/i });
      
      // Open dialog
      await chatButton.click();
      
      // Type a message but don't send
      const input = page.getByPlaceholder('Type your message...');
      await input.fill('Test message');
      
      // Close dialog
      const closeButton = page.getByRole('button', { name: /close chat/i });
      await closeButton.click();
      
      // Reopen dialog
      await chatButton.click();
      
      // Check if the message is still there
      await expect(input).toHaveValue('Test message');
    });
  });

  test.describe('Message Sending and Receiving', () => {
    test('should send message and receive response', async ({ page }) => {
      // Mock successful API response with proper SSE format
      await page.route('http://localhost:8080/api/genai/chatbot/help', async route => {
        // Create a proper SSE response that matches what the SSE utils expect
        const sseResponse = [
          'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":"!"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" How"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" can"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" I"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" help"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" you"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" today"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":"?"}}]}\n\n',
          'data: {"choices":[{"finish_reason":"stop"}]}\n\n',
          'data: [DONE]\n\n'
        ].join('');

        await route.fulfill({
          status: 200,
          headers: {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
            'connection': 'keep-alive'
          },
          body: sseResponse
        });
      });

      // Open chat dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();

      // Type and send message
      const input = page.getByPlaceholder('Type your message...');
      await input.fill('Hi');

      const sendButton = page.getByRole('button', { name: /send message/i });
      await sendButton.click();

      // Check that both user and bot messages appear correctly
      await expect(page.getByText('Hi').first()).toBeVisible();
      await expect(page.getByText('Hello! How can I help you today?')).toBeVisible();

      // Check if input is cleared
      await expect(input).toHaveValue('');
    });

    test('should handle Enter key submission', async ({ page }) => {
      // Mock the API response
      await page.route('**/api/genai/chatbot/help', async route => {
        const response = [
          'data: {"choices":[{"delta":{"content":"Response"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" via"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" Enter"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" key"}}]}\n\n',
          'data: {"choices":[{"finish_reason":"stop"}]}\n\n',
          'data: [DONE]\n\n'
        ].join('');
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'text/event-stream' },
          body: response
        });
      });

      // Open chat dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      // Type message and press Enter
      const input = page.getByPlaceholder('Type your message...');
      await input.fill('Test Enter key');
      await input.press('Enter');
      
      // Check if message was sent
      await expect(page.getByText('Test Enter key')).toBeVisible();
      await expect(page.getByText('Response via Enter key')).toBeVisible();
    });

    test('should not send empty messages', async ({ page }) => {
      // Open chat dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      // Send button should be disabled initially
      const sendButton = page.getByRole('button', { name: /send message/i });
      await expect(sendButton).toBeDisabled();
      
      // Type whitespace only
      const input = page.getByPlaceholder('Type your message...');
      await input.fill('   ');
      
      // Send button should still be disabled
      await expect(sendButton).toBeDisabled();
      
      // Try pressing Enter
      await input.press('Enter');
      
      // No message should appear
      await expect(page.getByText('   ')).not.toBeVisible();
    });

    test('should show loading state during API call', async ({ page }) => {
      // Mock delayed API response
      await page.route('**/api/genai/chatbot/help', async route => {
        // Delay the response
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = [
          'data: {"choices":[{"delta":{"content":"Delayed"}}]}\n\n',
          'data: {"choices":[{"delta":{"content":" response"}}]}\n\n',
          'data: {"choices":[{"finish_reason":"stop"}]}\n\n',
          'data: [DONE]\n\n'
        ].join('');
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'text/event-stream' },
          body: response
        });
      });

      // Open chat dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      // Send message
      const input = page.getByPlaceholder('Type your message...');
      await input.fill('Test loading');
      
      const sendButton = page.getByRole('button', { name: /send message/i });
      await sendButton.click();
      
      // Check loading states
      await expect(page.getByText('Processing...')).toBeVisible();
      await expect(page.getByText('Typing...')).toBeVisible();
      await expect(sendButton).toBeDisabled();
      await expect(input).toBeDisabled();
      
      // Wait for response
      await expect(page.getByText('Delayed response')).toBeVisible();
      
      // Check that loading states are cleared
      await expect(page.getByText('Processing...')).not.toBeVisible();
      await expect(page.getByText('Typing...')).not.toBeVisible();
      await expect(sendButton).not.toBeDisabled();
      await expect(input).not.toBeDisabled();
    });
  });

  test.describe('Error Handling', () => {
    test('should display error message when API fails', async ({ page }) => {
      // Mock API error
      await page.route('**/api/genai/chatbot/help', async route => {
        await route.fulfill({
          status: 500,
          body: 'Internal Server Error'
        });
      });

      // Open chat dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      // Send message
      const input = page.getByPlaceholder('Type your message...');
      await input.fill('Test error');
      
      const sendButton = page.getByRole('button', { name: /send message/i });
      await sendButton.click();
      
      // Check for error message in chat
      await expect(page.getByText("I'm sorry, I encountered an error processing your request. Please try again later.")).toBeVisible();
      
      // Check for error alert
      await expect(page.getByRole('alert')).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/api/genai/chatbot/help', async route => {
        await route.abort('failed');
      });

      // Open chat dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      // Send message
      const input = page.getByPlaceholder('Type your message...');
      await input.fill('Test network error');
      
      const sendButton = page.getByRole('button', { name: /send message/i });
      await sendButton.click();
      
      // Check for error handling
      await expect(page.getByText("I'm sorry, I encountered an error processing your request. Please try again later.")).toBeVisible();
    });

    test('should clear error when new message is sent', async ({ page }) => {
      // Mock first call to fail, second to succeed
      let callCount = 0;
      await page.route('**/api/genai/chatbot/help', async route => {
        callCount++;
        if (callCount === 1) {
          await route.fulfill({
            status: 500,
            body: 'Server Error'
          });
        } else {
          const response = `data: {"choices":[{"delta":{"content":"Success on retry"}}]}\n\ndata: [DONE]\n\n`;
          await route.fulfill({
            status: 200,
            headers: { 'content-type': 'text/event-stream' },
            body: response
          });
        }
      });

      // Open chat dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      const input = page.getByPlaceholder('Type your message...');
      const sendButton = page.getByRole('button', { name: /send message/i });
      
      // Send first message (should fail)
      await input.fill('First message');
      await sendButton.click();
      
      // Wait for error
      await expect(page.getByRole('alert')).toBeVisible();
      
      // Send second message (should succeed)
      await input.fill('Second message');
      await sendButton.click();
      
      // Error should be cleared
      await expect(page.getByRole('alert')).not.toBeVisible();
      await expect(page.getByText('Success on retry')).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Chat button should still be visible and functional
      const chatButton = page.getByRole('button', { name: /chat/i });
      await expect(chatButton).toBeVisible();
      
      // Open dialog
      await chatButton.click();
      
      // Dialog should be appropriately sized for mobile
      const dialog = page.getByText('Help Assistant').locator('..');
      await expect(dialog).toBeVisible();
      
      // Input should be functional
      const input = page.getByPlaceholder('Type your message...');
      await expect(input).toBeVisible();
      await input.fill('Mobile test');
      
      const sendButton = page.getByRole('button', { name: /send message/i });
      await expect(sendButton).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      const chatButton = page.getByRole('button', { name: /chat/i });
      await expect(chatButton).toBeVisible();
      
      await chatButton.click();
      
      // Dialog should be appropriately sized for tablet
      const dialog = page.getByText('Help Assistant').locator('..');
      await expect(dialog).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard accessible', async ({ page }) => {
      // Tab to the chat button
      await page.keyboard.press('Tab');
      
      // The chat button should be focused
      const chatButton = page.getByRole('button', { name: /chat/i });
      await expect(chatButton).toBeFocused();
      
      // Press Enter to open dialog
      await page.keyboard.press('Enter');
      
      // Dialog should open
      await expect(page.getByText('Help Assistant')).toBeVisible();
      
      // Tab to input field
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // Skip close button
      
      const input = page.getByPlaceholder('Type your message...');
      await expect(input).toBeFocused();
      
      // Type message and submit with Enter
      await page.keyboard.type('Keyboard test');
      await page.keyboard.press('Enter');
      
      // Message should appear
      await expect(page.getByText('Keyboard test')).toBeVisible();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      const chatButton = page.getByRole('button', { name: /chat/i });
      await expect(chatButton).toHaveAttribute('aria-label', 'chat');
      
      await chatButton.click();
      
      const closeButton = page.getByRole('button', { name: /close chat/i });
      await expect(closeButton).toHaveAttribute('aria-label', 'close chat');
      
      const sendButton = page.getByRole('button', { name: /send message/i });
      await expect(sendButton).toHaveAttribute('aria-label', 'send message');
    });
  });

  test.describe('Performance', () => {
    test('should handle multiple rapid messages', async ({ page }) => {
      // Mock API responses
      await page.route('**/api/genai/chatbot/help', async route => {
        const response = `data: {"choices":[{"delta":{"content":"Quick response"}}]}\n\ndata: [DONE]\n\n`;
        await route.fulfill({
          status: 200,
          headers: { 'content-type': 'text/event-stream' },
          body: response
        });
      });

      // Open chat dialog
      const chatButton = page.getByRole('button', { name: /chat/i });
      await chatButton.click();
      
      const input = page.getByPlaceholder('Type your message...');
      const sendButton = page.getByRole('button', { name: /send message/i });
      
      // Send multiple messages rapidly
      for (let i = 1; i <= 3; i++) {
        await input.fill(`Message ${i}`);
        await sendButton.click();
        
        // Wait for the message to appear before sending the next one
        await expect(page.getByText(`Message ${i}`)).toBeVisible();
        await expect(page.getByText('Quick response')).toBeVisible();
      }
      
      // All messages should be visible
      await expect(page.getByText('Message 1')).toBeVisible();
      await expect(page.getByText('Message 2')).toBeVisible();
      await expect(page.getByText('Message 3')).toBeVisible();
    });
  });
});
