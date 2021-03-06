import { css } from '@emotion/core'

const feedTransitionStyles = () => {
  return css`
    .recent-comments-feed-transition-transition-enter {
      opacity: 0.01;
    }

    .recent-comments-feed-transition-transition-enter.recent-comments-feed-transition-transition-enter-active {
      opacity: 1;
      transition: opacity 500ms ease-in;
    }

    .recent-comments-feed-transition-transition-leave {
      opacity: 1;
    }

    .recent-comments-feed-transition-transition-leave.recent-comments-feed-transition-transition-leave-active {
      opacity: 0.01;
      transition: opacity 300ms ease-in;
    }

    //
    .recent-comments-feed-transition-show-more-leave {
      opacity: 1;
    }
    .recent-comments-feed-transition-show-more-leave.recent-comments-feed-transition-show-more-leave-active {
      opacity: 0;
      transition: opacity 1s ease-in;
    }

    .recent-comments-feed-transition-show-more-enter {
      opacity: 0;
    }
    .recent-comments-feed-transition-show-more-enter.recent-comments-feed-transition-show-more-enter-active {
      opacity: 1;
      transition: opacity 1s ease-in;
    }

    .recent-comments-feed-transition-show-more-height {
      transition: height 0.5s ease-in-out;
    }
  `
}

const recentCommentStyles = {
  feedTransitionStyles,
}

export default recentCommentStyles
