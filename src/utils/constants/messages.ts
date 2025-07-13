const Messages = {
  Products: {
    Created:        'Product created successfully',
    CreationFailed: 'Failed to create product',
    Fetched:        'Products fetched successfully',
    FetchFailed:    'Failed to fetch products',
    FetchedOne:     'Product fetched successfully',
    FetchOneFailed: 'Failed to fetch product',
    Updated:        'Product updated successfully',
    UpdateFailed:   'Failed to update product',
    Deleted:        'Product deleted successfully',
    DeleteFailed:   'Failed to delete product',
  },
  Auth: {
    SignUpSuccess:      'Signup successful',
    SignUpFailed:       'Signup failed',
    SignInSuccess:      'Signin successful',
    SignInFailed:       'Invalid email or password',
    PasswordResetSent:  'Password reset link sent',
    PasswordResetFailed:'Failed to send reset link',
    PasswordResetSuccess:'Password reset successful',
    PasswordResetInvalid:'Invalid or expired reset token',
    OAuthError:         'OAuth authentication failed',
  },
  Server: {
    Error:              'Something went wrong',
  }
} as const;

export default Messages;
