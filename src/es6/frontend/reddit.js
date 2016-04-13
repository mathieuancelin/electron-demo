import 'es6-shim';
import 'es7-shim';
import Elem from 'elemjs';
import { ipcRenderer } from 'electron';

const Style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px 10px 10px 10px'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  subredditCell: {
    cursor: 'pointer',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ccc',
    width: '100%'
  },
  storyCell: {
    cursor: 'pointer',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ccc',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
};

function fetchSubreddit(subreddit) {
  return fetch(`http://www.reddit.com/r/${subreddit}.json?sort=top&t=month`)
    .then(r => r.json())
    .then(response => {
      return response.data.children
        .filter(item => !item.data.over_18)
        .filter(item => item.data.url && item.data.url.indexOf('imgur.com') > -1)
        .filter(item => item.data.preview && item.data.preview.images && item.data.preview.images.length > 0);
    });
}

function fetchSubreddits() {
  return fetch('http://www.reddit.com/reddits.json')
    .then(r => r.json())
    .then(r => r.data.children);
}

function Loading(props) {
  return (
    <div style={Style.container}>
      <div style={Style.title}><h3>{props.what}</h3></div>
      <div style={{ ...Style.content, alignItems: 'center', justifyContent: 'center' }}>
        <img style={{ marginTop: '100px', width: '200px' }} src={`file://${__dirname}/../../static/ring.gif`}/>
      </div>
    </div>
  );
}

function SubredditCell(props) {
  return (
    <div
      style={Style.subredditCell}
      onclick={props.open.bind(null, props.subreddit.display_name)}>
        {props.subreddit.title}
    </div>
  );
}

function AllSubreddits(props) {
  const quit = () => ipcRenderer.send('command', { type: 'quit-app' });
  const openSubreddit = (subreddit) => ipcRenderer.send('command', {
    type: 'open-subreddit-window',
    payload: {
      subreddit
    }
  });
  if (props.loading) {
    return (
      <Loading what="All subreddits" />
    );
  }
  return (
    <div style={Style.container}>
      <div style={Style.title}>
        <h3>All subreddits</h3>
        <button
          onclick={quit}
          style={{ marginLeft: '10px', marginTop: '13px' }}
          type="button"
          className="btn btn-danger btn-xs">
            <span className="glyphicon glyphicon-off"></span>
        </button>
      </div>
      <div style={Style.content}>
        {
          props.subreddits.map(subreddit => <SubredditCell subreddit={subreddit} open={openSubreddit} />)
        }
      </div>
    </div>
  );
}

function StoryCell(props) {
  const { url, width, height } = props.story.preview.images[0].source;
  return (
    <div
      style={Style.storyCell}
      onclick={props.open.bind(null, url, width, height)}>
        <img style={{ width: '60px', height: '60px' }} src={props.story.thumbnail} />
        <p style={{ marginLeft: '10px' }}>
          {props.story.title}
        </p>
    </div>
  );
}

function Subreddit(props) {
  const openImage = (url, width, height) => ipcRenderer.send('command', {
    type: 'open-image-window',
    payload: {
      url, width, height
    }
  });
  if (props.loading) {
    return (
      <Loading what={`Subreddit ${props.subreddit}`} />
    );
  }
  if (props.stories.length === 0) {
    return (
      <div style={Style.container}>
        <div style={Style.title}><h3>No Images :(</h3></div>
      </div>
    );
  }
  return (
    <div style={Style.container}>
      <div style={Style.title}><h3>{`Subreddit ${props.subreddit}`}</h3></div>
      <div style={Style.content}>
        {
          props.stories.map(story => <StoryCell story={story} open={openImage} />)
        }
      </div>
    </div>
  );
}

function Image(props) {
  return (
    <img style={{ width: '100vw' }} src={props.url} />
  );
}

export function showAllSubreddits(container) {
  Elem.render(<AllSubreddits subreddits={[]} loading={true} />, container);
  fetchSubreddits().then(data => {
    const subreddits = data.map(subreddit => subreddit.data);
    Elem.render(<AllSubreddits subreddits={subreddits} loading={false} />, container);
  });
}

export function showSubreddit(subreddit, container) {
  Elem.render(<Subreddit subreddit={subreddit} stories={[]} loading={true} />, container);
  fetchSubreddit(subreddit).then(data => {
    const stories = data.map(story => story.data);
    Elem.render(<Subreddit subreddit={subreddit} stories={stories} loading={false} />, container);
  });
}

export function showImage(url, container) {
  Elem.render(<Image url={url} />, container);
}
