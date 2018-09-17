import _ from 'lodash';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Parser as HtmlToReactParser } from 'html-to-react';
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Visibility,
} from 'semantic-ui-react';
import fetchData from '../redux/actions/fetchData';
import HeaderComponent from '../components/Header/HeaderComponent';

const htmlToReactParser = new HtmlToReactParser();

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '1em',
  marginTop: '4em',
  transition: 'box-shadow 0.5s ease, padding 0.5s ease',
};

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
};

const overlayStyle = {
  float: 'left',
  margin: '0em 3em 1em 0em',
};

const fixedOverlayStyle = {
  ...overlayStyle,
  position: 'fixed',
  top: '80px',
  zIndex: 10,
};

const overlayMenuStyle = {
  position: 'relative',
  left: 0,
  transition: 'left 0.5s ease',
};

const fixedOverlayMenuStyle = {
  ...overlayMenuStyle,
  left: '800px',
};

const LeftImage = () => (
  <Image
    floated="left"
    size="medium"
    src="/images/wireframe/square-image.png"
    style={{ margin: '2em 2em 2em -4em' }}
  />
);

const RightImage = () => (
  <Image
    floated="right"
    size="medium"
    src="/images/wireframe/square-image.png"
    style={{ margin: '2em -4em 2em 2em' }}
  />
);

const Paragraph = () => (
  <p>
    {[
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ',
      'tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas ',
      'semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ',
      'ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean ',
      'fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. ',
      'Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor ',
      'neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, ',
      'accumsan porttitor, facilisis luctus, metus',
    ].join('')}
  </p>
);

class SingleArticle extends Component {
  state = {
    menuFixed: false,
    overlayFixed: false,
  };

  componentDidMount() {
    const { loadData, match } = this.props;
    const { slug } = match.params;

    const singleArticleRequest = {
      url: `https://fargo-ah-staging.herokuapp.com/api/articles/${slug.trim()}`,
      type: 'currentArticle',
    };

    loadData(singleArticleRequest);
  }

  handleOverlayRef = (c) => {
    const { overlayRect } = this.state;

    if (!overlayRect) {
      this.setState({ overlayRect: _.pick(c.getBoundingClientRect(), 'height', 'width') });
    }
  };

  stickOverlay = () => this.setState({ overlayFixed: true });

  stickTopMenu = () => this.setState({ menuFixed: true });

  unStickOverlay = () => this.setState({ overlayFixed: false });

  unStickTopMenu = () => this.setState({ menuFixed: false });

  render() {
    const { menuFixed, overlayFixed, overlayRect } = this.state;
    const { currentArticle, history, currentUser } = this.props;
    // console.log(currentArticle.imageUrl);
    const ReactElement = htmlToReactParser.parse(unescape(currentArticle.title));
    const ReactElementBody = htmlToReactParser.parse(unescape(currentArticle.body));
    return (
      <div className="article-view">
        <HeaderComponent text="Home" history={history} user={currentUser} pathname="/" />
        {/* Heads up, style below isn't necessary for correct work of example, simply our docs defines other
            background color.
          */}
        <style>
          {`
          html, body {
            background: #fff;
          }
        `}
        </style>

        <Container text style={{ marginTop: '2em' }}>
          <Header className="article-title" as="h1">
            {ReactElement}
          </Header>
        </Container>
        <Container className="image-width">
          <img className="article-image" src={currentArticle.imageUrl} centered size="mini" />
        </Container>
        <Visibility
          onBottomPassed={this.stickTopMenu}
          onBottomVisible={this.unStickTopMenu}
          once={false}
        />

        <Container text>
          {/* Example with overlay menu is more complex, SUI simply clones all elements inside, but we should use a
              different approach.
              An empty Visibility element controls the need to change the fixing of element below, it also uses height
              and width params received from its ref for correct display.
            */}
          <Visibility
            offset={80}
            once={false}
            onTopPassed={this.stickOverlay}
            onTopVisible={this.unStickOverlay}
            style={overlayFixed ? { ...overlayStyle, ...overlayRect } : {}}
          />

          <div ref={this.handleOverlayRef} style={overlayFixed ? fixedOverlayStyle : overlayStyle}>
            <Menu
              icon="labeled"
              style={overlayFixed ? fixedOverlayMenuStyle : overlayMenuStyle}
              vertical
            >
              <Menu.Item>
                <Icon name="twitter" />
                Twitter
              </Menu.Item>

              <Menu.Item>
                <Icon name="facebook" />
                Share
              </Menu.Item>

              <Menu.Item>
                <Icon name="mail" />
                Email
              </Menu.Item>
            </Menu>
          </div>

          {ReactElementBody}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ currentArticle, currentUser }) => ({
  currentArticle,
  currentUser,
});

const mapDispatchToProps = dispatch => ({
  loadData: asyncData => dispatch(fetchData(asyncData)),
});

const ConnectedSingleArticle = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SingleArticle);

export default ConnectedSingleArticle;
