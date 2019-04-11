import { css } from '@emotion/core'

const feedTransitionStyles = () => {
  return css`
    .mentions-feed-transition-transition-enter {
      opacity: 0.01;
    }

    .mentions-feed-transition-transition-enter.mentions-feed-transition-transition-enter-active {
      opacity: 1;
      transition: opacity 500ms ease-in;
    }

    .mentions-feed-transition-transition-leave {
      opacity: 1;
    }

    .mentions-feed-transition-transition-leave.mentions-feed-transition-transition-leave-active {
      opacity: 0.01;
      transition: opacity 300ms ease-in;
    }

    //
    .mentions-feed-transition-show-more-leave {
      opacity: 1;
    }
    .mentions-feed-transition-show-more-leave.mentions-feed-transition-show-more-leave-active {
      opacity: 0;
      transition: opacity 1s ease-in;
    }

    .mentions-feed-transition-show-more-enter {
      opacity: 0;
    }
    .mentions-feed-transition-show-more-enter.mentions-feed-transition-show-more-enter-active {
      opacity: 1;
      transition: opacity 1s ease-in;
    }

    .mentions-feed-transition-show-more-height {
      transition: height 0.5s ease-in-out;
    }
  `
}

const recentCommentStyles = {
  feedTransitionStyles,
}

export default recentCommentStyles
