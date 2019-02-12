// componentWillUnmount() {
//   window.removeEventListener("scroll", this.handleScroll);
// }

// componentDidUpdate() {
//   const { activateScroll } = this.state
//   console.log(this.state.loading)
//   console.log(this.rightElement.clientHeight, 'right')
//   console.log(this.leftElement.clientHeight, 'left')
//
//   if (!activateScroll && this.rightElement.clientHeight > this.leftElement.clientHeight) {
//     this.setState({ activateScroll: true }, () => {
//       window.addEventListener("scroll", this.handleScroll)
//     })
//   }
// }

// handleScroll = () => {
//     const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
//     const body = document.body;
//     const html = document.documentElement;
//     const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
//     const windowBottom = windowHeight + window.pageYOffset;
//
//     if (windowBottom >= docHeight) {
//         this.setState({
//           message: 'bottom reached',
//           style: {
//             position: 'absolute',
//             bottom: '15px',
//             left: '12px'
//           }
//         });
//     } else if (window.pageYOffset < 20) {
//       this.setState({
//         style: {
//           position: 'absolute',
//           top: '0',
//           left: '12px'
//         }
//       })
//     } else {
//         this.setState({
//           message: 'not at bottom',
//         });
//     }
// }
