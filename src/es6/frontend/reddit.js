import 'es6-shim';
import 'es7-shim';
import Elem from 'elemjs';

import { fetchSubreddits, fetchSubreddit } from './services/http';
import { Image } from './components/Image';
import { AllSubreddits } from './components/AllSubreddits';
import { Subreddit } from './components/Subreddit';

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
