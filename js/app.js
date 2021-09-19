const BASE_API_URL = 'http://localhost:1500';
const DEFAULT_PRODUCT_API_URL = `${ BASE_API_URL }/product/default`;
const REVIEW_API_URL = `${ BASE_API_URL }/review`;

(function (exports) {
  $(function () {
    const titleEl = $('.product__title');
    const avgRatingEl = $('.product__avg-rating');
    const productStarsEl = $('.product__stars');

    const openReviewBtn = $('.product__open-review');
    const closeReviewBtn = $('.form__close-btn');

    const reviewsListEl = $('.reviews__list');

    const reviewModal = $('.modal');
    const activeStars = $('.stars--active');

    const starsTemplate = $('#stars-template').html();
    const reviewItemTemplate = $('#review-item-template').html();

    openReviewBtn.click(openReviewModal)
    closeReviewBtn.click(closeReviewModal)

    function openReviewModal() {
      reviewModal.show()
    }

    function closeReviewModal() {
      reviewModal.hide();
    }

    function populateProductDetails(product) {
      titleEl.text(product.name);
      avgRatingEl.text(product.averageRating);

      const starsTemplate = getStarsTemplate(product.averageRating);
      productStarsEl.append(starsTemplate);

      product.reviews.forEach((review) => {
        const template = $('<div></div>');
        template.html(reviewItemTemplate);

        template.find('.reviews__rating-num').text(review.rating);
        template.find('.reviews__rating-text').text(review.text);

        const reviewStarsTemplate = getStarsTemplate(review.rating);
        template.find('.reviews__stars').append(reviewStarsTemplate);

        reviewsListEl.append(template);
      })
    }

    function getStarsTemplate(rating) {
      const template = $('<div></div>');
      template.html(starsTemplate);

      const width = Math.round(rating) / 5 * 100;
      template.find('.stars__on').css('width', `${ width }%`)
      return template;
    }

    function setUpStars() {
      activeStars.each(function () {
        const stars = $(this);
        const starsOnEl = stars.find('.stars__on');
        const ratingInput = stars.find('.form__rating');

        function updateRating(rating) {
          const width = Number(rating) / 5 * 100;
          starsOnEl.css('width', `${ width }%`);
        }

        let starsValue = 0;

        stars
          .find('.stars__btn')
          .hover(function () {
            updateRating($(this).data('rating'));
          }, function () {
            isHovering = false;
            updateRating(starsValue);
          })
          .click(function () {
            starsValue = $(this).data('rating');
            updateRating(starsValue);
            ratingInput.val(starsValue);
          })
          .end();
      });
    }

    function loadDefaultProduct() {
      fetch(DEFAULT_PRODUCT_API_URL)
        .then(response => response.json())
        .then((data) => {
          const { data: product } = data;
          populateProductDetails(product)
        });
    }

    loadDefaultProduct();
    setUpStars();
  });


})(this);
