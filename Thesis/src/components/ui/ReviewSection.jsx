import { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { reviewAPI } from '../../services/backendApi';
import { formatDate } from '../../utils/formatters';

const ReviewSection = ({ gameId }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [gameId]);

  const fetchReviews = async () => {
    try {
      const data = await reviewAPI.getGameReviews(gameId);
      setReviews(data);
      
      // Find user's review
      if (isAuthenticated) {
        const review = data.find(r => r.userId === user?.id);
        setUserReview(review);
        if (review) {
          setRating(review.rating);
          setComment(review.comment || '');
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await reviewAPI.getGameReviewStats(gameId);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch review stats:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to submit a review');
      return;
    }

    try {
      await reviewAPI.addReview(gameId, rating, comment);
      await fetchReviews();
      await fetchStats();
      setShowForm(false);
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm('Are you sure you want to delete your review?')) return;

    try {
      await reviewAPI.deleteReview(gameId);
      await fetchReviews();
      await fetchStats();
      setUserReview(null);
      setComment('');
      setRating(5);
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <div className="bg-[#1a1a1a] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Reviews</h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-black text-white">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
              </div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">{stats.reviewCount}</div>
              <div className="text-gray-400 text-sm">Total Reviews</div>
            </div>
          </div>
        </div>

        {/* Rating Stars Display */}
        {stats.averageRating > 0 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${
                  star <= Math.round(stats.averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add Review Form */}
      {isAuthenticated && (
        <div className="bg-[#1a1a1a] rounded-lg p-6">
          {userReview ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">Your Review</h4>
                <button
                  onClick={handleDeleteReview}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete Review
                </button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <= userReview.rating ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {userReview.comment && (
                <p className="text-gray-300 mt-2">{userReview.comment}</p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                Reviewed on {formatDate(userReview.createdAt)}
              </p>
            </div>
          ) : (
            <>
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
                >
                  Write a Review
                </button>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-3xl transition-all ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Comment (Optional)</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="4"
                      placeholder="Share your thoughts about this game..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-[#1a1a1a] rounded-lg">
            <p className="text-gray-400">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-[#1a1a1a] rounded-lg p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">{review.username}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-300 mt-3">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

