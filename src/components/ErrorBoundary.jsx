import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Something unexpected went wrong.',
    };
  }

  componentDidCatch(error, info) {
    console.error('ClaimClear UI error:', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <h2>We hit a snag</h2>
          <p>
            ClaimClear ran into an unexpected problem and stopped this screen so the rest of the
            app wouldn&apos;t crash. You can try again, or escalate to a human adjuster if it keeps
            happening.
          </p>
          {this.state.message ? (
            <p className="error-boundary-detail">{this.state.message}</p>
          ) : null}
          <div className="error-boundary-actions">
            <button type="button" className="send-btn" onClick={this.handleReset}>
              Try again
            </button>
            <button
              type="button"
              className="escalate-btn-top"
              onClick={() => window.location.reload()}
            >
              Reload the page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
