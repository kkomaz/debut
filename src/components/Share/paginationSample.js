/**
 * This could use some refactoring <3
*/
// renderShareCommentInfo = () => {
//   const { share } = this.props
//   const { commentView } = this.state
//
//   const result = (
//     share.commentCount && share.commentCount !== _.get(share, 'comments.length', 0) &&
//     <p
//       onClick={this.fetchShareComments}
//       className="small share-list-item__view-more-comments"
//       >
//       View Comments
//     </p>
//   )
//
//   if (result === 0) {
//     return null
//   }
//
//   if (_.isEqual(result, false)) {
//     if (commentView) {
//       return (
//         <p
//           onClick={this.hideCommentView}
//           className="small share-list-item__hide-comments"
//           >
//           Hide comments
//         </p>
//       )
//     } else {
//       return (
//         <p
//           onClick={this.showCommentView}
//           className="small share-list-item__view-more-comments"
//           >
//           View comments
//         </p>
//       )
//     }
//   }
//
//   return result
// }
// 
// showCommentView = () => {
//   return this.setState({ commentView: true })
// }
//
// hideCommentView = () => {
//   return this.setState({ commentView: false })
// }
