const BASE_API_URL = 'http://localhost:1500';
const DEFAULT_PRODUCT_SLUG = 'default';
const DEFAULT_PRODUCT_API_URL = `${ BASE_API_URL }/product/${ DEFAULT_PRODUCT_SLUG }`;
const REVIEW_API_URL = `${ BASE_API_URL }/review`;

(function (exports) {
  $(function () {
    const app = $('.app');
    const loader = $('.loader');
    const titleEl = $('.product__title');
    const avgRatingEl = $('.product__avg-rating');
    const productStarsEl = $('.product__stars');

    const openReviewBtn = $('.product__open-review');
    const closeReviewBtn = $('.form__close-btn');

    const reviewsListEl = $('.reviews__list');

    const reviewModal = $('.modal');
    const activeStars = $('.stars--active');

    const form = $('#form');
    const ratingInput = $('#form__rating');
    const textInput = $('#form__text');
    const formError = form.find('.form__error');

    const starsTemplate = $('#stars-template').html();
    const reviewItemTemplate = $('#review-item-template').html();

    openReviewBtn.click(openReviewModal)
    closeReviewBtn.click(closeReviewModal)
    form.submit(submitForm)

    function openReviewModal() {
      reviewModal.show()
    }

    function closeReviewModal() {
      reviewModal.hide();
      ratingInput.val(0);
      textInput.val('');

      ratingInput.change();
    }

    function submitForm(e) {
      e.preventDefault();

      const rating = Number(ratingInput.val());
      const text = textInput.val() || '';

      if (rating === 0) {
        formError.show();
        return;
      }

      const body = JSON.stringify({
        rating,
        text,
        product: DEFAULT_PRODUCT_SLUG,
      })

      fetch(REVIEW_API_URL, {
        method: 'POST',
        body
      })
        .then(response => response.json())
        .then(({ data }) => {
          const { review, averageRating } = data;
          updateProductRating(averageRating);
          addProductReview(review, true);
          closeReviewModal();
        })
    }

    function populateProductDetails(product) {
      titleEl.text(product.name);
      avgRatingEl.text(product.averageRating);

      const starsTemplate = getStarsTemplate(product.averageRating);
      productStarsEl.append(starsTemplate);

      product.reviews.forEach((review) => {
        addProductReview(review);
      })
    }

    function updateProductRating(averageRating) {
      avgRatingEl.text(averageRating);
      const starsTemplate = getStarsTemplate(averageRating);
      productStarsEl.empty();
      productStarsEl.append(starsTemplate);
    }

    function addProductReview(review, prepend) {
      const template = $('<div></div>');
      template.html(reviewItemTemplate);

      template.find('.reviews__rating-num').text(review.rating);
      template.find('.reviews__rating-text').text(review.text);

      const reviewStarsTemplate = getStarsTemplate(review.rating);
      template.find('.reviews__stars').append(reviewStarsTemplate);

      prepend ? reviewsListEl.prepend(template) : reviewsListEl.append(template);
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
        const ratingInput = stars.find('#form__rating');

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
            formError.hide();
            updateRating(starsValue);
            ratingInput.val(starsValue);
          })
          .end();

        ratingInput.change(function () {
          const value = Number($(this).val());

          // Reset values if rating is reset from outside this closure
          if (value === 0) {
            starsValue = 0;
            updateRating(starsValue);
          }
        });
      });
    }

    function loadDefaultProduct() {
      fetch(DEFAULT_PRODUCT_API_URL)
        .then(response => response.json())
        .then((data) => {
          const { data: product } = data;
          populateProductDetails(product)
          loader.hide();
          app.show();
        });
    }

    loadDefaultProduct();
    setUpStars();
  });


})(this);
