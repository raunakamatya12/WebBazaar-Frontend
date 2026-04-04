"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addComment, getCommentsByProduct, deleteComment } from "@/api/comment";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import config from "@/config";

export default function CommentSectionClient({ productId }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canComment, setCanComment] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  const user = useSelector((state) => state.auth.user);
  const userId = user?._id || user?.id;

  // Check if user can comment (has purchased this product)
  useEffect(() => {
    if (!userId) {
      setCheckingPermission(false);
      return;
    }

    const checkCanComment = async () => {
      try {
        setCheckingPermission(true);
        const res = await axios.get(
          `${config.apiUrl}/api/comments/${productId}/can-comment`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setCanComment(res.data.canComment);
      } catch (err) {
        console.error("Can comment check error:", err);
        setCanComment(false);
      } finally {
        setCheckingPermission(false);
      }
    };

    checkCanComment();
  }, [userId, productId, user?.token]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getCommentsByProduct(productId);
      setComments(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!canComment) {
      toast.error("You can only review products you have purchased and received.");
      return;
    }

    try {
      await addComment({ productId, userId, text });
      setText("");
      toast.success("Comment posted!");
      fetchComments();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to post comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(commentId);
      toast.success("Comment deleted!");
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  return (
    <section className="max-w-xl mx-auto mt-12 px-4 sm:px-0">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 border-b pb-2">
        Comments ({comments.length})
      </h2>

      {!user ? (
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Please log in to post a comment.
        </p>
      ) : checkingPermission ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          Checking permissions...
        </p>
      ) : !canComment ? (
        <p className="text-center text-amber-600 dark:text-amber-400 mb-6 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          You can only review products you have purchased and received. 📦
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!text.trim()}
              className="bg-blue-600 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              Post Comment
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading comments...
        </p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <ul className="space-y-5">
          {comments.map((c) => (
            <li
              key={c._id}
              className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {typeof c.userId === "object"
                      ? c.userId.name || "Unknown User"
                      : "Unknown User"}
                  </p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {c.text}
                  </p>
                  {c.sentimentScore !== undefined && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Sentiment Score: {c.sentimentScore}
                    </p>
                  )}
                </div>
                {userId ===
                  (typeof c.userId === "object" ? c.userId._id : c.userId) && (
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
                    title="Delete comment"
                    aria-label="Delete comment">
                    <FaTrashAlt size={18} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
