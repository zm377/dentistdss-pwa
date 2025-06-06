import { render, screen } from '@testing-library/react';

// Test basic React functionality
describe('React Components', () => {
  test('renders simple component', () => {
    function SimpleComponent() {
      return <div>Hello World</div>;
    }
    
    render(<SimpleComponent />);
    const element = screen.getByText(/hello world/i);
    expect(element).toBeInTheDocument();
  });

  test('renders component with props', () => {
    function GreetingComponent({ name }) {
      return <div>Hello {name}!</div>;
    }
    
    render(<GreetingComponent name="React" />);
    const element = screen.getByText(/hello react!/i);
    expect(element).toBeInTheDocument();
  });

  test('renders component with conditional content', () => {
    function ConditionalComponent({ showMessage }) {
      return (
        <div>
          {showMessage && <span>Message is visible</span>}
          {!showMessage && <span>Message is hidden</span>}
        </div>
      );
    }
    
    render(<ConditionalComponent showMessage={true} />);
    expect(screen.getByText(/message is visible/i)).toBeInTheDocument();
    
    render(<ConditionalComponent showMessage={false} />);
    expect(screen.getByText(/message is hidden/i)).toBeInTheDocument();
  });
});
