import React, { useEffect, useState } from "react";
import * as subscriptions from "../../../api/subscription";

const articles = [
  {
    id: "A100",
    name: "Aricle 100"
  },
  {
    id: "A200",
    name: "Aricle 200"
  },
  {
    id: "A300",
    name: "Aricle 300"
  },
  {
    id: "A400",
    name: "Aricle 400"
  }
];

/* Custom hook 
  1. It should start with 'use' so that react can identify that the function is a hook.
  2. Every call to a custom hook has its own isolated state. So calling the same hook from 2 different components will create 2 isolated state. 
  3. 2 components sharing same hook don't share the state.
  4. It takes an input and returns an output.
  5. You can pass the result of one hook into another.
*/
const useArticleViews = articleId => {
  const [activeViewsList, setActiveViews] = useState({});
  const [componentId] = useState(Math.floor(Math.random() * 10000));
  useEffect(() => {
    const views = subscriptions.subscribeActiveArticleViews(
      articleId,
      componentId,
      views => setActiveViews({ ...activeViewsList, [articleId]: views })
    );
    if (views === 0 || views) {
      setActiveViews({ ...activeViewsList, [articleId]: views });
    }
    return () =>
      subscriptions.unsubscribeActiveArticleViews(articleId, componentId);
  }, [articleId]);
  return activeViewsList[articleId];
};

function Show_Active_Views_Using_Effect({ articleId }) {
  const views = useArticleViews(articleId);
  const checkIfViewsLoaded = views === 0 || views;
  return (
    <>
      <h2>Article Primary Details Component</h2>
      <p>Article {articleId}</p>
      <div>
        Active Users Count : {checkIfViewsLoaded ? views : "Loading..."}
      </div>
    </>
  );
}

function UsersActiveOnArticle({ articleId }) {
  const views = useArticleViews(articleId);
  const checkIfViewsLoaded = views === 0 || views;
  return (
    <>
      <h2>Article Secondary Details Component</h2>
      <p>
        Number of active viewers for this article are{" "}
        {checkIfViewsLoaded ? views : "Loading..."}
      </p>
    </>
  );
}

export function Subscription() {
  const [articleId, setArticleId] = useState("A100");
  return (
    <>
      {articles.map(({ id, name }) => (
        <button
          onClick={() => {
            setArticleId(id);
          }}
        >
          {name}
        </button>
      ))}
      <Show_Active_Views_Using_Effect articleId={articleId} />
      <UsersActiveOnArticle articleId={articleId} />
    </>
  );
}
