import React, { useEffect, useState, Component, useLayoutEffect } from "react";
import * as subscriptions from "../../api/subscription";

export default function UseEffect() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export function With_Effect_CleanUp() {
  useEffect(() => {
    const intId = setInterval(() => console.log("effect"), 2000);
    return () => {
      clearInterval(intId);
    };
  });
  return (
    <div>
      Check the console and see the continuos loggin of effect which stop once
      we navigate to some other component
    </div>
  );
}

export class With_Class_CleanUp extends Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }
  componentDidMount() {
    this.intId = setInterval(() => console.log("effect"), 2000);
  }
  componentWillUnmount() {
    clearInterval(this.intId);
  }
  render() {
    return (
      <div>
        Check the console and see the continuos loggin of effect which stop once
        we navigate to some other component
      </div>
    );
  }
}

export function With_Effects_Lifecyle() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 0) {
      console.log("componentDidMount");
    } else {
      console.log("componentDidUpdate");
    }
    return () => {
      console.log("componentWillUnmount");
    };
  });
  console.log("render");
  return (
    <>
      <span>Count : {count} </span>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Upate counter
      </button>
      <p>Check the console for every click</p>
    </>
  );
}

export class With_Sync_Using_Class extends Component {
  componentDidMount() {
    alert("Stop screen update");
  }
  render() {
    return <div>Rendered in Class</div>;
  }
}

export function With_Async_Effect() {
  useEffect(() => {
    alert("Stop screen update");
  });
  return <div>Rendered in Async Effect</div>;
}

export function With_Sync_Effect() {
  useLayoutEffect(() => {
    alert("Stop screen update");
  });
  return <div>Rendered in Sync Effect</div>;
}

function Show_Active_Views_Using_Effect({ articleId }) {
  const [activeViewsList, setActiveViews] = useState({});
  const [componentId] = useState(Math.floor(Math.random() * 10000));
  const checkIfViewsLoaded = views => views === 0 || views;
  useEffect(() => {
    const views = subscriptions.subscribeActiveArticleViews(
      articleId,
      componentId,
      views => setActiveViews({ ...activeViewsList, [articleId]: views })
    );
    if (checkIfViewsLoaded(views)) {
      setActiveViews({ ...activeViewsList, [articleId]: views });
    }
    return () =>
      subscriptions.unsubscribeActiveArticleViews(articleId, componentId);
  }, [articleId]);
  return (
    <>
      <p>Article {articleId}</p>
      <div>
        Active Users Count :{" "}
        {checkIfViewsLoaded(activeViewsList[articleId])
          ? activeViewsList[articleId]
          : "Loading..."}
      </div>
    </>
  );
}

// Notice that we are have the subscription logic in 3 lifecycle methods. Even though the code is inter-related but still it
// divided in 3 lifecycle methods. Also it takes an extra render cycle. It is handled better using useEffect.
class Show_Acitve_Views_Using_Class extends Component {
  constructor(props) {
    super(props);
    this.state = { componentId: Math.floor(Math.random() * 10000) };
    this.updateViews = this.updateViews.bind(this);
    this.checkIfViewsLoaded = this.checkIfViewsLoaded.bind(this);
  }

  updateViews(views) {
    const { articleId } = this.props;
    if (this.checkIfViewsLoaded(views)) {
      this.setState({ [articleId]: views });
    }
  }

  checkIfViewsLoaded(views) {
    return views === 0 || views;
  }

  componentDidMount() {
    const { articleId } = this.props;
    const { componentId } = this.state;
    const views = subscriptions.subscribeActiveArticleViews(
      articleId,
      componentId,
      views => this.setState({ [articleId]: views })
    );
    this.updateViews(views);
  }
  componentDidUpdate(prevProps) {
    const { articleId } = this.props;
    const { componentId } = this.state;
    if (prevProps.articleId !== articleId) {
      subscriptions.unsubscribeActiveArticleViews(articleId, componentId);
      const views = subscriptions.subscribeActiveArticleViews(
        articleId,
        views => this.setState({ [articleId]: views })
      );
      this.updateViews(views);
    }
  }
  componentWillUnmount() {
    const { articleId } = this.props;
    subscriptions.unsubscribeActiveArticleViews(articleId);
  }
  render() {
    const { articleId } = this.props;
    const activeViews = this.state[articleId];
    return (
      <>
        <p>Article {articleId}</p>
        <div>
          Active Users Count :{" "}
          {this.checkIfViewsLoaded(activeViews) ? activeViews : "Loading..."}
        </div>
      </>
    );
  }
}

export function With_Subscription_Using_Effect() {
  const [articleId, setArticleId] = useState("A100");
  const [isFunctionalView, setComponent] = useState(true);
  return (
    <>
      <button
        onClick={() => {
          setArticleId("A100");
        }}
      >
        Article 100
      </button>
      <button
        onClick={() => {
          setArticleId("A200");
        }}
      >
        Article 200
      </button>
      <button
        onClick={() => {
          setArticleId("A300");
        }}
      >
        Article 300
      </button>
      <button
        onClick={() => {
          setArticleId("A400");
        }}
      >
        Article 400
      </button>
      {isFunctionalView ? (
        <Show_Active_Views_Using_Effect articleId={articleId} />
      ) : (
        <Show_Acitve_Views_Using_Class articleId={articleId} />
      )}
      <button
        onClick={() => {
          setComponent(!isFunctionalView);
        }}
      >
        {`Change to ${isFunctionalView ? "class" : "functional"} view`}
      </button>
    </>
  );
}
