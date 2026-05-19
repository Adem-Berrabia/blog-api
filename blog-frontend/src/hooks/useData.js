import { useState, useEffect, useCallback } from "react";
import { articlesAPI, commentsAPI } from "../api/services";

export function useArticles(params = {}) {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      setError(null);
      try {
        const res = await articlesAPI.getAll({ ...params, ...overrides });
        const d = res.data;
        const payload = d.data || d;

        setArticles(
          Array.isArray(payload.articles)
            ? payload.articles
            : Array.isArray(payload.data)
              ? payload.data
              : [],
        );
        const pageData = payload.pagination || payload;
        setPagination({
          page: pageData.page || pageData.currentPage || 1,
          totalPages: pageData.totalPages || pageData.pages || 1,
          total: pageData.total || pageData.count || 0,
        });
      } catch (e) {
        setError(e.response?.data?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)],
  );

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { articles, pagination, loading, error, refetch: fetch };
}

export function useArticle(id) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    articlesAPI
      .getOne(id)
      .then((res) => setArticle(res.data.data || res.data.article || res.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Article introuvable"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  return { article, loading, error };
}

export function useComments(articleId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleId) return;
    commentsAPI
      .getByArticle(articleId)
      .then((res) => {
        const data = res.data;
        // ✅ Handle all possible response shapes safely
        const result = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.comments)
              ? data.comments
              : Array.isArray(data.data?.comments)
                ? data.data.comments
                : [];
        setComments(result);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [articleId]);

  const addComment = async (text) => {
    const res = await commentsAPI.create(articleId, { content: text });
    const newComment = res.data.data || res.data.comment || res.data;
    // ✅ Only add if valid object with _id
    if (newComment && newComment._id) {
      setComments((prev) => [...prev, newComment]);
    }
  };

  const removeComment = async (id) => {
    await commentsAPI.delete(id);
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  return { comments, loading, addComment, removeComment };
}
