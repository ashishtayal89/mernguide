const activeArticleSubscriptions = {};
const articleActiveViews = { A100: 100, A200: 300 };

const activateSubscriptions = articleId => {
  setInterval(() => {
    articleActiveViews[articleId] += 1;
  }, 1000);
};

const fetchArticleViews = articleId => {
  articleActiveViews[articleId] = null;
  return new Promise(resolve => {
    setTimeout(() => {
      articleActiveViews[articleId] = 0;
      resolve();
    }, 2000);
  });
};

export const subscribeActiveArticleViews = function(
  articleId,
  componentId,
  handleUpdate
) {
  if (!Object.keys(articleActiveViews).includes(articleId)) {
    fetchArticleViews(articleId).then(() => activateSubscriptions(articleId));
  }
  activeArticleSubscriptions[`${articleId}-${componentId}`] = setInterval(
    () => {
      handleUpdate(articleActiveViews[articleId]);
    },
    2000
  );
  return articleActiveViews[articleId];
};

export const unsubscribeActiveArticleViews = (articleId, componentId) => {
  clearInterval(activeArticleSubscriptions[`${articleId}-${componentId}`]);
  delete activeArticleSubscriptions[`${articleId}-${componentId}`];
};

(function activeSubscriptions() {
  Object.keys(articleActiveViews).map(articleId => {
    activateSubscriptions(articleId);
  });
})();
