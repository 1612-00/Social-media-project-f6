export const ERROR = {
  COMMON_SYSTEM_ERROR: {
    CODE: 'sys00001',
    MESSAGE: 'An error has arisen from the system. Please try again later or contact us for a fix.',
  },

  // Authentication user
  CONFIRM_ACCOUNT_FAILURE: {
    CODE: 'sys00001',
    MESSAGE: 'Invalid or expired email.',
  },
  ACCOUNT_IS_NOT_VERIFIED: {
    CODE: 'sys00001',
    MESSAGE: 'Account is not verified.',
  },
  SEND_MAIL_FAILURE: {
    CODE: 'sys00001',
    MESSAGE: 'Send email failure.',
  },

  // user
  USER_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'User not found, disabled or locked',
  },
  USER_HAD_BLOCKED: {
    CODE: 'us00001',
    MESSAGE: 'User had blocked',
  },
  USERNAME_OR_PASSWORD_INCORRECT: {
    CODE: 'us00002',
    MESSAGE: 'Username or password is incorrect',
  },
  EMAIL_ALREADY_EXIST: {
    CODE: 'us00001',
    MESSAGE: 'Email already exist',
  },
  USER_ID_ALREADY_EXIST: {
    CODE: 'us00001',
    MESSAGE: 'User id already exist',
  },
  DONT_PERMISSION_ACCESS: {
    CODE: 'us00002',
    MESSAGE: 'You dont have permission to access',
  },
  DONT_PERMISSION_DELETE: {
    CODE: 'us00002',
    MESSAGE: 'You dont have permission to delete',
  },
  NOT_TRY_LOGOUT_FROM_EARTH: {
    CODE: 'us00002',
    MESSAGE: 'Not try logout from earth!!!',
  },
  UNAUTHENTICATED_USER: {
    CODE: 'us00002',
    MESSAGE: 'Unauthenticated user',
  },

  // friend
  FRIEND_REQ_EXIST: {
    CODE: 'us00001',
    MESSAGE: 'Friend request already exist',
  },
  ALREADY_FRIEND: {
    CODE: 'us00001',
    MESSAGE: 'Already friend',
  },
  FRIEND_REQ_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'Friend request not found',
  },
  NOT_FRIEND: {
    CODE: 'us00001',
    MESSAGE: 'Not friend',
  },
  INVALID_REQ: {
    CODE: 'us00001',
    MESSAGE: 'Invalid request',
  },

  // Black list
  DONT_INTERACTIVE_MYSELF: {
    CODE: 'us00001',
    MESSAGE: "Don't interactive myself",
  },
  USER_HAS_BLOCKED: {
    CODE: 'us00001',
    MESSAGE: 'User has blocked',
  },
  USER_HAS_NOT_BLOCKED: {
    CODE: 'us00001',
    MESSAGE: 'User has not blocked',
  },

  // Post
  CREATE_POST_FAILED: {
    CODE: 'us00001',
    MESSAGE: 'Create post failed',
  },
  POST_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'Post not found',
  },

  // Profile picture
  AVATAR_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'Profile picture not found',
  },
  IS_CURRENT_PROFILE_PICTURE: {
    CODE: 'us00001',
    MESSAGE: 'Is current profile picture',
  },
  UPLOAD_PROFILE_PICTURE_FAILED: {
    CODE: 'us00001',
    MESSAGE: 'Upload profile picture failed',
  },
  RETRIEVE_PROFILE_PICTURE_FAILED: {
    CODE: 'us00001',
    MESSAGE: 'Retrieve profile picture failed',
  },
};
